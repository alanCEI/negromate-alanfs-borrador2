import Order from '../db/models/Order.model.js';
import Product from '../db/models/Product.model.js';

// --- Obtener todas las órdenes (Solo Admin) ---
export const getAllOrders = async (req, res, next) => {
    const ResponseAPI = {
        msg: "Lista de órdenes obtenida",
        data: [],
        status: 'ok'
    };

    try {
        const orders = await Order.find({})
            .populate('user', 'username email')
            .populate('items.product', 'name imageUrl');
        ResponseAPI.data = orders;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Obtener las órdenes del usuario logueado ---
export const getUserOrders = async (req, res, next) => {
    const ResponseAPI = {
        msg: "Órdenes del usuario obtenidas",
        data: [],
        status: 'ok'
    };

    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name imageUrl');
        ResponseAPI.data = orders;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Obtener una orden por su ID ---
export const getOrderById = async (req, res, next) => {
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Orden encontrada",
        data: null,
        status: 'ok'
    };

    try {
        const order = await Order.findById(id)
            .populate('user', 'username email')
            .populate('items.product', 'name imageUrl');

        if (!order) {
            ResponseAPI.msg = "Orden no encontrada";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Verificar que el usuario solo pueda ver sus propias órdenes, a menos que sea admin
        if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
            ResponseAPI.msg = "No tienes permiso para ver esta orden";
            ResponseAPI.status = 'error';
            return res.status(403).json(ResponseAPI);
        }

        ResponseAPI.data = order;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Crear una nueva orden ---
export const createOrder = async (req, res, next) => {
    const { orderItems } = req.body; // El frontend enviará los items del carrito

    const ResponseAPI = {
        msg: "Orden creada con éxito",
        data: null,
        status: 'ok'
    };

    if (!orderItems || orderItems.length === 0) {
        ResponseAPI.msg = "No hay artículos en la orden";
        ResponseAPI.status = 'error';
        return res.status(400).json(ResponseAPI);
    }

    try {
        // Calcular el monto total en el backend para seguridad
        const itemsFromDB = await Product.find({
            _id: { $in: orderItems.map(item => item.product) }
        });

        let totalAmount = 0;
        const processedItems = orderItems.map(item => {
            const dbProduct = itemsFromDB.find(p => p._id.toString() === item.product);
            if (!dbProduct) {
                throw new Error(`Producto con id ${item.product} no encontrado.`);
            }
            totalAmount += dbProduct.price * item.quantity;
            return {
                product: item.product,
                quantity: item.quantity,
                price: dbProduct.price
            };
        });

        const order = new Order({
            user: req.user._id, // El usuario viene del authMiddleware
            items: processedItems,
            totalAmount: totalAmount
        });

        const createdOrder = await order.save();
        ResponseAPI.data = createdOrder;
        res.status(201).json(ResponseAPI);

    } catch (error) {
        next(error);
    }
};


// --- Actualizar el estado de una orden (Solo Admin) ---
export const updateOrderStatus = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const ResponseAPI = {
        msg: "Estado de la orden actualizado",
        data: null,
        status: 'ok'
    };

    try {
        const order = await Order.findById(id);

        if (!order) {
            ResponseAPI.msg = "Orden no encontrada";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Validar que el estado sea válido
        const validStatuses = ['pending', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            ResponseAPI.msg = "Estado inválido. Debe ser: pending, completed o cancelled";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        if (status !== undefined) order.status = status;

        const updatedOrder = await order.save();
        ResponseAPI.data = updatedOrder;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Eliminar una orden (Solo Admin) ---
export const deleteOrder = async (req, res, next) => {
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Orden eliminada con éxito",
        data: null,
        status: 'ok'
    };

    try {
        const order = await Order.findById(id);

        if (!order) {
            ResponseAPI.msg = "Orden no encontrada";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        await Order.findByIdAndDelete(id);
        ResponseAPI.data = { _id: id };
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};
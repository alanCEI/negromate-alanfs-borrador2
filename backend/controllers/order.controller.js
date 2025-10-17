import Order from '../db/models/Order.model.js';
import Product from '../db/models/Product.model.js';

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
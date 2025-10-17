import Product from '../db/models/Product.model.js';

// --- Obtener todos los productos o filtrados por categoría ---
export const getProducts = async (req, res, next) => {
    const { category } = req.query; // Filtro opcional por categoría
    const filter = category ? { category } : {};

    const ResponseAPI = {
        msg: "Productos obtenidos correctamente",
        data: [],
        status: 'ok'
    };

    try {
        const products = await Product.find(filter);
        if (products.length === 0) {
            ResponseAPI.msg = "No se encontraron productos para esta categoría";
        } else {
             ResponseAPI.data = products;
        }
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Obtener un solo producto por su ID ---
export const getProductById = async (req, res, next) => {
    const { id } = req.params;
    
    const ResponseAPI = {
        msg: "Producto encontrado",
        data: null,
        status: 'ok'
    };

    try {
        const product = await Product.findById(id);
        if (product) {
            ResponseAPI.data = product;
            res.status(200).json(ResponseAPI);
        } else {
            ResponseAPI.msg = "Producto no encontrado";
            ResponseAPI.status = 'error';
            res.status(404).json(ResponseAPI);
        }
    } catch (error) {
        next(error);
    }
};
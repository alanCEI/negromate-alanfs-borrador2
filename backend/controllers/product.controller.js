import Product from '../db/models/Product.model.js';
import { mockData } from '../db/data.mock.js';

// --- Obtener productos y galería por categoría (endpoint consolidado) ---
export const getProductsWithGallery = async (req, res, next) => {
    const { category } = req.params;

    const ResponseAPI = {
        msg: "Datos obtenidos correctamente",
        data: {
            products: [],
            gallery: []
        },
        status: 'ok'
    };

    try {
        // Obtener productos de la categoría
        const products = await Product.find({ category });

        // Obtener galería según la categoría
        let gallery = [];
        const galleryMap = {
            'GraphicDesign': 'graphicDesign',
            'CustomClothing': 'customClothing',
            'Murals': 'murals'
        };

        const galleryKey = galleryMap[category];
        if (galleryKey && mockData.galleryImages[galleryKey]) {
            gallery = mockData.galleryImages[galleryKey];
        }

        ResponseAPI.data = {
            products,
            gallery
        };

        if (products.length === 0 && gallery.length === 0) {
            ResponseAPI.msg = `No se encontraron datos para la categoría '${category}'`;
        }

        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};

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


// --- Crear un nuevo producto (Solo Admin) ---
export const createProduct = async (req, res, next) => {
    const { name, category, price, imageUrl, description, details } = req.body;

    const ResponseAPI = {
        msg: "Producto creado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        if (!name || !category || !price) {
            ResponseAPI.msg = "Los campos name, category y price son obligatorios";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        const newProduct = await Product.create({
            name,
            category,
            price,
            imageUrl: imageUrl || '',
            description: description || '',
            details: details || []
        });

        ResponseAPI.data = newProduct;
        res.status(201).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Actualizar un producto por su ID (Solo Admin) ---
export const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, category, price, imageUrl, description, details } = req.body;

    const ResponseAPI = {
        msg: "Producto actualizado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        const product = await Product.findById(id);

        if (!product) {
            ResponseAPI.msg = "Producto no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        // Actualizar solo los campos proporcionados
        if (name !== undefined) product.name = name;
        if (category !== undefined) product.category = category;
        if (price !== undefined) product.price = price;
        if (imageUrl !== undefined) product.imageUrl = imageUrl;
        if (description !== undefined) product.description = description;
        if (details !== undefined) product.details = details;

        const updatedProduct = await product.save();
        ResponseAPI.data = updatedProduct;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};


// --- Eliminar un producto por su ID (Solo Admin) ---
export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;

    const ResponseAPI = {
        msg: "Producto eliminado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        const product = await Product.findById(id);

        if (!product) {
            ResponseAPI.msg = "Producto no encontrado";
            ResponseAPI.status = 'error';
            return res.status(404).json(ResponseAPI);
        }

        await Product.findByIdAndDelete(id);
        ResponseAPI.data = { _id: id };
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};
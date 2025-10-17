import express from 'express';

// Importar controladores
import { registerUser, loginUser, getUserProfile } from '../controllers/auth.controller.js';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsWithGallery } from '../controllers/product.controller.js';
import { getAllOrders, getUserOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder } from '../controllers/order.controller.js';
import { getAllContent, getContentBySection, createContent, updateContent, deleteContent } from '../controllers/content.controller.js';

// Importar middlewares
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ========================================
// RUTAS DE AUTENTICACIÓN (/api/auth)
// ========================================
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/profile', authMiddleware, getUserProfile);

// ========================================
// RUTAS DE USUARIOS (/api/users)
// ========================================
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/users/:id', authMiddleware, updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUser);

// ========================================
// RUTAS DE PRODUCTOS (/api/products)
// ========================================
router.get('/products', getProducts);
router.get('/products/category/:category', getProductsWithGallery);
router.get('/products/:id', getProductById);
router.post('/products', authMiddleware, adminMiddleware, createProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, deleteProduct);

// ========================================
// RUTAS DE ÓRDENES (/api/orders)
// ========================================
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);
router.get('/orders/myorders', authMiddleware, getUserOrders);
router.get('/orders/:id', authMiddleware, getOrderById);
router.post('/orders', authMiddleware, createOrder);
router.put('/orders/:id', authMiddleware, adminMiddleware, updateOrderStatus);
router.delete('/orders/:id', authMiddleware, adminMiddleware, deleteOrder);

// ========================================
// RUTAS DE CONTENIDO (/api/content)
// ========================================
router.get('/content', authMiddleware, adminMiddleware, getAllContent);
router.get('/content/:sectionName', getContentBySection);
router.post('/content', authMiddleware, adminMiddleware, createContent);
router.put('/content/:id', authMiddleware, adminMiddleware, updateContent);
router.delete('/content/:id', authMiddleware, adminMiddleware, deleteContent);

export default router;

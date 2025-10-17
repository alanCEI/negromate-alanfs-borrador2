import express from 'express';
import { createOrder, getUserOrders } from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas de órdenes requieren que el usuario esté autenticado
router.use(authMiddleware);

router.post('/', createOrder);
router.get('/myorders', getUserOrders);

export default router;
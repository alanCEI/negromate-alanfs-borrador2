import express from 'express';
import { getAllUsers } from '../controllers/user.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Ruta protegida solo para administradores
router.get('/', authMiddleware, adminMiddleware, getAllUsers);

export default router;
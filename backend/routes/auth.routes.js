import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware, getUserProfile);

export default router;
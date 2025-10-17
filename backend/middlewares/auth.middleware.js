import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';
import User from '../db/models/User.model.js';

export const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No autorizado, token no proporcionado o formato incorrecto.' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Adjuntar el usuario al objeto request, excluyendo la contraseña
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ msg: 'No autorizado, usuario no encontrado.' });
        }

        next(); // El usuario está autenticado, continuar con la siguiente función
    } catch (error) {
        console.error('Error de autenticación:', error);
        res.status(401).json({ msg: 'No autorizado, token inválido.' });
    }
};

// Middleware opcional para verificar si el usuario es administrador
export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ msg: 'Acceso denegado, requiere rol de administrador.' });
    }
};
import User from '../db/models/User.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

// Función para generar un token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d', // El token expira en 30 días
    });
};

// --- Registro de un nuevo usuario ---
export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    const ResponseAPI = {
        msg: "Usuario registrado con éxito",
        data: null,
        status: 'ok'
    };

    try {
        if (!username || !email || !password) {
            ResponseAPI.msg = "Todos los campos son obligatorios";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            ResponseAPI.msg = "El email ya está registrado";
            ResponseAPI.status = 'error';
            return res.status(400).json(ResponseAPI);
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el nuevo usuario
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            const token = generateToken(newUser._id);
            ResponseAPI.data = {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                token: token,
            };
            res.status(201).json(ResponseAPI);
        } else {
            ResponseAPI.msg = "Datos de usuario inválidos";
            ResponseAPI.status = 'error';
            res.status(400).json(ResponseAPI);
        }
    } catch (error) {
        next(error);
    }
};


// --- Inicio de sesión de un usuario ---
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    const ResponseAPI = {
        msg: "Inicio de sesión exitoso",
        data: null,
        status: 'ok'
    };

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            ResponseAPI.data = {
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token,
            };
            res.status(200).json(ResponseAPI);
        } else {
            ResponseAPI.msg = "Credenciales inválidas";
            ResponseAPI.status = 'error';
            res.status(401).json(ResponseAPI);
        }
    } catch (error) {
        next(error);
    }
};


// --- Obtener perfil del usuario autenticado ---
export const getUserProfile = async (req, res, next) => {
     const ResponseAPI = {
        msg: "Perfil de usuario obtenido",
        data: req.user, // req.user es adjuntado por el authMiddleware
        status: 'ok'
    };
    res.status(200).json(ResponseAPI);
};
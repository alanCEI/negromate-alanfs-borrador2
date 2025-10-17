import User from '../db/models/User.model.js';

// Este controlador podría usarse para futuras funcionalidades de admin,
// como listar todos los usuarios.

export const getAllUsers = async (req, res, next) => {
     const ResponseAPI = {
        msg: "Lista de usuarios obtenida",
        data: [],
        status: 'ok'
    };
    try {
        const users = await User.find({}).select('-password'); // Excluir contraseñas
        ResponseAPI.data = users;
        res.status(200).json(ResponseAPI);
    } catch (error) {
        next(error);
    }
};
import express from 'express';
import cors from 'cors';
import { PORT } from './config/config.js';
import { connectDB } from './db/mongoose.js';
import errorMiddleware from './middlewares/error.middleware.js';

// Importar Rutas
import apiRoutes from './routes/index.routes.js';

const app = express();

// Middlewares base
app.use(cors()); // Habilita CORS para permitir peticiones desde el frontend
app.use(express.json()); // Permite al servidor entender JSON en el body de las peticiones
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rutas de la API
app.get('/', (req, res) => {
    res.json({ message: 'API de Negromate Creatives funcionando correctamente' });
});

app.use('/api', apiRoutes);


// Middleware de manejo de errores (debe ir al final)
app.use(errorMiddleware);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
};

startServer();
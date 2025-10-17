import mongoose from 'mongoose';
import { DB_USER, DB_PASS, CLUSTER, DATABASE } from '../config/config.js';
import { mockData } from './data.mock.js';
import Content from './models/Content.model.js';
import Product from './models/Product.model.js';


export const connectDB = async () => {
    const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(url);
        console.log("✅ Conectado a MongoDB Atlas");
        console.log(`DB: ${mongoose.connection.db.databaseName}`);
        
        // Opcional: Poblar la base de datos si está vacía
        await populateDatabase();

    } catch (error) {
        console.error(`❌ Error al conectar con MongoDB: ${error}`);
        process.exit(1); // Detiene la aplicación si no se puede conectar a la DB
    }
};

// Función para poblar la base de datos con datos iniciales
const populateDatabase = async () => {
    try {
        // Poblar contenido (About Us, etc.)
        const contentCount = await Content.countDocuments();
        if (contentCount === 0) {
            await Content.insertMany(mockData.content);
            console.log("📚 Contenido inicial insertado en la base de datos.");
        }

        // Poblar productos
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.insertMany(mockData.products);
            console.log("🛍️ Productos iniciales insertados en la base de datos.");
        }

    } catch (error) {
        console.error("🔥 Error al poblar la base de datos:", error);
    }
};
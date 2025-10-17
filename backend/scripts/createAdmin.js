import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../db/models/User.model.js';
import { DB_USER, DB_PASS, CLUSTER, DATABASE } from '../config/config.js';

const createAdminUser = async () => {
    const url = `mongodb+srv://${DB_USER}:${DB_PASS}@${CLUSTER}/${DATABASE}?retryWrites=true&w=majority`;

    try {
        // Conectar a MongoDB
        await mongoose.connect(url);
        console.log("✅ Conectado a MongoDB Atlas");

        // Datos del usuario admin
        const adminData = {
            username: 'admin',
            email: 'admin@negromate.com',
            password: 'admin123', // Cambia esto por una contraseña segura
            role: 'admin'
        };

        // Verificar si el usuario admin ya existe
        const adminExists = await User.findOne({ email: adminData.email });

        if (adminExists) {
            console.log("⚠️ El usuario admin ya existe en la base de datos.");
            console.log(`Email: ${adminExists.email}`);
            console.log(`Role: ${adminExists.role}`);
            process.exit(0);
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Crear el usuario admin
        const adminUser = await User.create({
            username: adminData.username,
            email: adminData.email,
            password: hashedPassword,
            role: 'admin'
        });

        console.log("✅ Usuario admin creado exitosamente!");
        console.log("=======================================");
        console.log(`ID: ${adminUser._id}`);
        console.log(`Username: ${adminUser.username}`);
        console.log(`Email: ${adminUser.email}`);
        console.log(`Role: ${adminUser.role}`);
        console.log("=======================================");
        console.log("\n🔐 Credenciales de acceso:");
        console.log(`Email: ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);
        console.log("\n⚠️ IMPORTANTE: Cambia la contraseña después del primer login");

        process.exit(0);

    } catch (error) {
        console.error("❌ Error al crear usuario admin:", error);
        process.exit(1);
    }
};

// Ejecutar la función
createAdminUser();

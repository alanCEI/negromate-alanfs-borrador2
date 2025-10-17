import dotenv from 'dotenv';

// Cargar variables de entorno según el ambiente
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
} else {
    dotenv.config();
}

export const PORT = process.env.PORT || 3000;
export const DB_USER = process.env.DB_USER;
export const DB_PASS = process.env.DB_PASS;
export const CLUSTER = process.env.CLUSTER;
export const DATABASE = process.env.DATABASE;
export const JWT_SECRET = process.env.JWT_SECRET;
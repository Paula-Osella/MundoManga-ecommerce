
import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Función para conectar a MongoDB
export const initMongoDB = async () => {
    try {
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_URL no está definida en el archivo .env");
        }

        await mongoose.connect(mongoUrl);

        console.log("✅ Conexión a MongoDB exitosa");
    } catch (error) {
        console.error("❌ Error de conexión a MongoDB:", error);
        throw error; 
    }
};


export const isValidID = (id) => Types.ObjectId.isValid(id);


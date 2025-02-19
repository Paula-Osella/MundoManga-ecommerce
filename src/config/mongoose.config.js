import mongoose, { Types } from "mongoose";
import dotenv from "dotenv";

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Función para conectar a MongoDB
export const initMongoDB = async () => {
    try {
        // Obtener la URL de conexión desde las variables de entorno
        const mongoUrl = process.env.MONGO_URL;
        if (!mongoUrl) {
            throw new Error("MONGO_URL no está definida en el archivo .env");
        }

        // Conectar a la base de datos
        await mongoose.connect(mongoUrl); // Sin las opciones deprecated

        console.log("Conexión a MongoDB exitosa");
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
        throw error; 
    }
};

export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};

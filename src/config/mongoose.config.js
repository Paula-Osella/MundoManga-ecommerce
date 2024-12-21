import { connect, Types } from "mongoose";

export const connectDB = async () => {
    const URL =
        "mongodb+srv://paulaosella19:dAInHItJbuaRb7dD@cluster0.dccu1.mongodb.net/bdMundoManga?retryWrites=true&w=majority&appName=Cluster0";
    try {
        await connect(URL);
        console.log("Estás conectado a MongoDB!");
    } catch (error) {
        console.log("Hubo un error al conectar con MongoDB...", error.message);
    }

};

export const isValidID = (id) => {
    return Types.ObjectId.isValid(id);
};
import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URL,
    secretKey: process.env.SECRET_KEY,
    mailUser: process.env.GMAIL,  // Se toma el correo de .env
    mailPass: process.env.PASS_GOOGLE, // Se toma la clave de .env
};

export default config;
import dotenv from 'dotenv';

dotenv.config()



export default {
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGO_URL,
    secretKey: process.env.SECRET_KEY
};
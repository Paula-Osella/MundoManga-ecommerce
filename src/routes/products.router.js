import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/products.controller.js"; // Asegúrate de que el nombre del archivo del controlador sea correcto (product.controller.js)
import { roleAuth } from "../middlewares/roleAuth.js";
import passport from "passport";
import { uploader } from '../config/multer.config.js'; // <-- ¡Importa Multer aquí!

const router = Router();

router.route('/')
    .get(getAllProducts)
    // Aplica el middleware de Multer para la subida de un solo archivo llamado 'thumbnail'
    .post(passport.authenticate('jwt', { session: false }), roleAuth('ADMIN'), uploader.single('thumbnail'), createProduct); 

router.route('/:pid')
    .get(getProductById)
    // Aplica el middleware de Multer también para la actualización si vas a permitir subir nuevas imágenes
    .put(passport.authenticate('jwt', { session: false }), roleAuth('ADMIN'), uploader.single('thumbnail'), updateProduct) 
    .delete(passport.authenticate('jwt', { session: false }), roleAuth('ADMIN'), deleteProduct); 

export default router;

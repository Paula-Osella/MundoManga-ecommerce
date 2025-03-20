import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/products.controller.js";
import { roleAuth } from "../middlewares/roleAuth.js"; // Importamos roleAuth

const router = Router();

router.route('/')
.get(getAllProducts)
.post(roleAuth('admin'), createProduct); // Solo el admin puede crear productos

router.route('/:pid')
.get(getProductById)
.put(roleAuth('admin'), updateProduct) // Solo el admin puede actualizar productos
.delete(roleAuth('admin'), deleteProduct); // Solo el admin puede eliminar productos

export default router;

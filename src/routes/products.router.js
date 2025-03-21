import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/products.controller.js";
import { roleAuth } from "../middlewares/roleAuth.js"; 

const router = Router();

router.route('/')
.get(getAllProducts)
.post(roleAuth('admin'), createProduct);

router.route('/:pid')
.get(getProductById)
.put(roleAuth('admin'), updateProduct) 
.delete(roleAuth('admin'), deleteProduct); 

export default router;

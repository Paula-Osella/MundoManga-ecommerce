import { Router } from "express";
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/products.controller.js";
import { roleAuth } from "../middlewares/roleAuth.js";
import passport from "passport"; 

const router = Router();

router.route('/')
    .get(getAllProducts)
    .post(passport.authenticate('jwt', { session: false }), roleAuth('ADMIN'), createProduct); 

router.route('/:pid')
    .get(getProductById)
    .put(passport.authenticate('jwt', { session: false }), roleAuth('ADMIN'), updateProduct) 
    .delete(passport.authenticate('jwt', { session: false }), roleAuth('ADMIN'), deleteProduct); 

export default router;

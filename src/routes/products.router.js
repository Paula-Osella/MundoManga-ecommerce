import { Router } from "express";
import * as controllers from '../controllers/products.controller.js';

const router = Router();


router.get('/', controllers.getAllProducts);
router.get('/:pid', controllers.getProductById);
router.get('/category/:categoryName',  controllers.getProductsByCategory);
router.post('/', controllers.addProduct);
router.put('/:pid', controllers.updateProduct);
 router.delete('/:pid', controllers.deleteProduct);


export default router;

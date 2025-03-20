import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js"; // Importa el cartController

const router = Router();


router.post("/", cartController.createCart);


router.route('/:cartId/product/:prodId')
    .post(cartController.addProdToCart) 
    .delete(cartController.removeProdFromCart)
    .put(cartController.updateProdQuantityToCart);


router.route("/:cartId")
    .get(cartController.getCartById)
    .delete(cartController.clearCart);

export default router;

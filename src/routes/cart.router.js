import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";

const router = Router();



router.get("/:cartId", cartController.getCartById);

router.post("/", cartController.createCart);


router.post("/:cartId/product/:prodId", cartController.addProdToCart);


router.delete("/:cartId/product/:prodId", cartController.removeProdFromCart);


router.put("/:cartId/product/:prodId", cartController.updateProdQuantityToCart);


router.delete("/:cartId", cartController.clearCart);

export default router;


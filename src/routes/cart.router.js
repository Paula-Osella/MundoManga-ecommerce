import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { passportCall } from "../passport/passportCall.js"; // Importamos passportCall
import { roleAuth } from "../middlewares/roleAuth.js";

const router = Router();

router.post("/", passportCall("current"), cartController.createCart); // ✅ Solo usuarios autenticados pueden crear un carrito

router.route('/:cartId/product/:prodId')
    .post(passportCall("current"), roleAuth("user"), cartController.addProdToCart)  // ✅ Solo usuarios pueden agregar productos
    .delete(passportCall("current"), roleAuth("user"), cartController.removeProdFromCart)
    .put(passportCall("current"), roleAuth("user"), cartController.updateProdQuantityToCart);

router.route("/:cartId")
    .get(passportCall("current"), cartController.getCartById) // ✅ Solo autenticados pueden ver su carrito
    .delete(passportCall("current"), roleAuth("user"), cartController.clearCart);

export default router;


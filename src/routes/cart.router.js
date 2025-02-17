import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";

const router = Router();



router.get("/:cartId", cartController.getCartById);
// Crear un carrito
router.post("/", cartController.createCart);

// Agregar un producto al carrito
router.post("/:cartId/product/:prodId", cartController.addProdToCart);

// Eliminar un producto del carrito
router.delete("/:cartId/product/:prodId", cartController.removeProdFromCart);

// Actualizar la cantidad de un producto en el carrito
router.put("/:cartId/product/:prodId", cartController.updateProdQuantityToCart);

// Limpiar el carrito
router.delete("/:cartId", cartController.clearCart);

export default router;


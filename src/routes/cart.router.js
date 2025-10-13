import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import passport from "passport";
import { roleAuth } from "../middlewares/roleAuth.js";

const router = Router();

// Estrategia que lee el JWT desde la cookie `jwt`
const cookieAuth = passport.authenticate("current", { session: false });

router.route("/")
  // Listar todos los carritos: solo ADMIN
  .get(cookieAuth, roleAuth("ADMIN"), cartController.getAllCarts)
  // Crear carrito: USER o ADMIN
  .post(cookieAuth, roleAuth("USER", "ADMIN"), cartController.createCart);

router.route("/:cartId")
  // Ver carrito propio: USER o ADMIN
  .get(cookieAuth, roleAuth("USER", "ADMIN"), cartController.getCartById)
  // Vaciar carrito: USER o ADMIN
  .delete(cookieAuth, roleAuth("USER", "ADMIN"), cartController.clearCart);

router.route("/:cartId/products/:prodId")
  // Operaciones de items en carrito: USER o ADMIN
  .post(cookieAuth, roleAuth("USER", "ADMIN"), cartController.addProdToCart)
  .put(cookieAuth, roleAuth("USER", "ADMIN"), cartController.updateProdQuantityToCart)
  .delete(cookieAuth, roleAuth("USER", "ADMIN"), cartController.removeProdFromCart);

router.route("/:cartId/purchase")
  // Comprar: USER o ADMIN
  .post(cookieAuth, roleAuth("USER", "ADMIN"), cartController.completePurchase);
router.post("/:cartId/checkout", cookieAuth, roleAuth("USER", "ADMIN"), cartController.completePurchase);

export default router;


import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import passport from "passport";
import { roleAuth } from "../middlewares/roleAuth.js";

const router = Router();

router.route("/")
    .post(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.createCart); //se puede

router.route("/:cartId")
    .get(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.getCartById) //aun no
    .delete(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.clearCart); // aun no

router.route("/:cartId/products/:prodId")
    .post(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.addProdToCart) // se puede 
    .put(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.updateProdQuantityToCart) // si funciona, se puede actualizar un solo producto a la vez, pero se puede agregar otro en el post 
    .delete(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.removeProdFromCart); // aun no 

export default router;
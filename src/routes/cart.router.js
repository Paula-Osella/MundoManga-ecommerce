import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import passport from "passport";
import { roleAuth } from "../middlewares/roleAuth.js";


const router = Router();

router.route("/")
.get(passport.authenticate("jwt", { session: false }), roleAuth("ADMIN"), cartController.getAllCarts) 
    .post(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.createCart); 

router.route("/:cartId")
    .get(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.getCartById) 
    .delete(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.clearCart); 

router.route("/:cartId/products/:prodId")
    .post(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.addProdToCart) 
    .put(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.updateProdQuantityToCart) 
    .delete(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.removeProdFromCart); 

    router.route("/:cartId/purchase")
    .post(passport.authenticate("jwt", { session: false }), roleAuth("USER"), cartController.completePurchase);
    
export default router;
import { Router } from "express";
import {
    getAllProducts,
    getCartById,
    showRegister,
    registerUser,
    showLogin,
    loginUser,
    changePasswordPage
} from "../controllers/homeview.controller.js";

const router = Router();

// Ruta para obtener todos los productos
router.get('/products', getAllProducts);

// Ruta para ver un carrito por ID
router.get("/carts/:cid", getCartById);

// Rutas para el registro de usuario
router.get("/register", showRegister);
router.post("/register", registerUser);

// Rutas para el inicio de sesión de usuario
router.get("/login", showLogin);
router.post("/login", loginUser);
router.get('/change-password', changePasswordPage);

export default router;

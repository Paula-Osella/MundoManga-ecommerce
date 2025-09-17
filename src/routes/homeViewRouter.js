import { Router } from "express";
import {
    getAllProducts,
    getCartById,
    showRegister,
    registerUser,
    showLogin,
    loginUser,
 showForgotPassword,
  showChangePassword, // nuevo nombre
  showResetPassword,
  logoutUser
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
router.get('/logout', logoutUser);

router.get('/reset-password', showResetPassword);
// Rutas para el proceso de "olvidé mi contraseña"
router.get('/forgot-password', showForgotPassword);
router.get('/change-password', showChangePassword);

// alias para links antiguos /user/change-password
router.get('/user/change-password', (req, res) => {
  const token = req.query.token || '';
  return res.redirect(`/change-password?token=${encodeURIComponent(token)}`);
});


export default router;

import { Router } from "express";
import {userController} from "../controllers/user.controller.js";
import { passportCall } from "../passport/passportCall.js";


const router = Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

router.get("/current", passportCall('jwt'), userController.privateData);
router.put('/change-password', userController.changePassword) 
// RESET POR TOKEN (flujo “olvidé mi contraseña”)
// ⬇️ NUEVAS RUTAS PARA RECUPERO DE CLAVE
router.post('/forgot-password', userController.requestPasswordReset);
router.put('/reset-password', userController.resetPasswordByToken);

export default router; 

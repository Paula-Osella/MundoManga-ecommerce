import Controllers from "./controller.manager.js";
import { userService } from '../services/user.services.js';
import { UserDTO } from "../dtos/userdto.js";
import { logger } from '../config/logger.js';


class UserController extends Controllers {
  constructor(){
    super(userService);
  }

  register = async (req, res, next) => {
    try {
      logger.info('Intentando registrar un nuevo usuario'); 
      logger.debug('Datos de registro:', req.body); 
      const user = await this.service.register(req.body);
      logger.info(`Usuario registrado con éxito. ID: ${user._id}`); 
      res.status(201).json({ status: 'success', payload: user });
    } catch (error) {
      logger.error('Error en UserController al registrar usuario:', error); 

      next(error);
    }
  };
  
  login = async (req, res, next) => {
    try {
      logger.info('Intentando iniciar sesión de usuario'); 
      logger.debug('Credenciales de inicio de sesión:', { email: req.body.email }); 
      const token = await this.service.login(req.body);
      logger.info('Usuario ha iniciado sesión con éxito. Token generado.'); 
      res.cookie('jwt', token, { httpOnly: true }).json({ message: 'Logged in', token });
    } catch (error) {
      logger.error('Error en UserController al iniciar sesión:', error);
      next(error);
    }
  };
  
  privateData = async (req, res, next) => {
    try {
      logger.info('Accediendo a datos privados del usuario'); 
      if (!req.user) {
        logger.warn('Intento de acceso a datos privados sin usuario autenticado.');
        throw new Error("Cannot access user info");
      }
      logger.debug('Información de usuario en req.user:', req.user); 
      const user = await this.service.getById(req.user._id); 
      if (!user) {
        logger.warn(`Usuario no encontrado en la base de datos con ID: ${req.user._id}`); 
        return res.status(404).json({ status: "Error", message: "User not validated" });
      }
      logger.info(`Datos privados obtenidos para usuario ID: ${user._id}`); 
      res.json({ user });
    } catch (error) {
      logger.error('Error en UserController al acceder a datos privados:', error); 
      next(error);
    }
  };

  changePassword = async(req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const token = req.headers.authorization?.split(' ')[1]; 
      logger.info('Intentando cambiar la contraseña del usuario'); 

      if (!currentPassword || !newPassword) {
        logger.warn('Intento de cambio de contraseña sin contraseña actual o nueva.');
        return res.status(400).json({ status: "error", message: "Both current and new passwords are required" });
      }

      if (!token) {
        logger.warn('Intento de cambio de contraseña sin token de autorización.'); 
        return res.status(401).json({ status: "error", message: "Token is required" });
      }

      logger.debug("Token recibido para cambio de contraseña:", token); 
    
      
      const decoded = await userService.verifyTokenPassword(token); 
      logger.debug('Token decodificado para cambio de contraseña:', decoded); 

      if (!decoded) {
        logger.warn('Token inválido o expirado para cambio de contraseña.');
        return res.status(401).json({ status: "error", message: "Invalid or expired token" });
      }

      const result = await userService.changePassword(decoded.email, currentPassword, newPassword);
      logger.info(`Contraseña cambiada con éxito para el usuario: ${decoded.email}`); 

      res.status(200).json({ message: result.message });

    } catch (error) {
      logger.error('Error en UserController al cambiar contraseña:', error); 
      next(error);
    }
  }
}

export const userController = new UserController();
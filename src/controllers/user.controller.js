import Controllers from "./controller.manager.js";
import { userService } from '../services/user.services.js';
import { UserDTO } from "../dtos/userdto.js";

class UserController extends Controllers {
  constructor(){
    super(userService);
  }

  register = async (req, res, next) => {
    try {
      const user = await this.service.register(req.body);
      res.status(201).json({ status: 'success', payload: user });
    } catch (error) {
      console.error('Error en UserController:', error);
      next(error);
    }
  };
  
  login = async (req, res, next) => {
    try {
      const token = await this.service.login(req.body);
      res.cookie('jwt', token, { httpOnly: true }).json({ message: 'Logged in', token });
    } catch (error) {
      next(error);
    }
  };
  
  privateData = async (req, res, next) => {
    try {
      if (!req.user) throw new Error("Cannot access user info");
      console.log(req.user);
      const user = await this.service.getById(req.user._id); // Asegúrate de pasar el _id, no todo el objeto user
      if (!user) {
        return res.status(404).json({ status: "Error", message: "User not validated" });
      }
      res.json({ user });
    } catch (error) {
      next(error);
    }
  };
  
}

export const userController = new UserController();

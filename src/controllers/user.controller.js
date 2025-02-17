import Controllers from "./controller.manager.js";
import { userService } from '../services/user.services.js';

class UserController extends Controllers {
  constructor(){
    super(userService)
  }

  register = async (req, res, next) => {
    try {
      const user = await this.service.register(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
  
  login = async (req, res, next) => {
    try {
      const token = await this.service.login(req.body);
      res
        .cookie('token', token, { httpOnly: true })
        .json({ message: 'Login OK', token });
    } catch (error) {
      next(error);
    }
  };
  
  privateData = async (req, res, next) => {
    try {
        if (!req.user) throw new Error("No se puede acceder a los datos del usuario");

        const user = await this.service.getById(req.user._id);
        console.log(user);  

        if (!user) throw new Error("User not found");


        const populatedUser = await user.populate("cart");
        res.json({
            user: populatedUser,
            cart: populatedUser.cart, 
        });
    } catch (error) {
        next(error);
    }
};
}

export const userController = new UserController();
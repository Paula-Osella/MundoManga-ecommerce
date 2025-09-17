import jwt from "jsonwebtoken";
import { userService } from "../services/user.services.js";

export const sessionLocals = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;
    let username = null;
    let cartId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        username = decoded?.email || null;

        if (username) {
          const user = await userService.getUserByEmail(username);
          if (user?.cart) cartId = String(user.cart);
        }
      } catch {
        // token inválido o expirado → ignoramos
      }
    }

    res.locals.username = username;
    res.locals.cartId = cartId;
  } catch (error) {
    res.locals.username = null;
    res.locals.cartId = null;
  }
  next();
};

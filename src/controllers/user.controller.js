import Controllers from "./controller.manager.js";
import { userService } from "../services/user.services.js";

class UserController extends Controllers {
  constructor() {
    super(userService);
  }

  register = async (req, res) => {
    try {
      await this.service.register(req.body);
      res.redirect("/login?message=registro_exitoso");
    } catch (error) {
      console.error("Error en UserController al registrar usuario:", error);
      res.redirect("/register?error=" + encodeURIComponent(error.message));
    }
  };

  login = async (req, res) => {
    try {
      const token = await this.service.login(req.body);
      const isApiRequest = req.originalUrl.includes("/api/");
      if (isApiRequest) {
        return res.status(200).json({ status: "success", token });
      }
      res.cookie("jwt", token, { httpOnly: true }).redirect("/products?message=login_exitoso");
    } catch (error) {
      const isApiRequest = req.originalUrl.includes("/api/");
      if (isApiRequest) {
        return res.status(401).json({ status: "error", message: error.message });
      }
      res.redirect("/login?error=" + encodeURIComponent(error.message));
    }
  };

  logout = (req, res) => {
    res.clearCookie("jwt");
    res.redirect("/login?message=logout_exitoso");
  };

  privateData = async (req, res, next) => {
    try {
      if (!req.user) throw new Error("Cannot access user info");
      const user = await this.service.getById(req.user._id);
      if (!user) {
        return res.status(404).json({ status: "Error", message: "User not validated" });
      }
      res.json({ user });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const token = req.headers.authorization?.split(" ")[1];

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ status: "error", message: "Both current and new passwords are required" });
      }
      if (!token) {
        return res.status(401).json({ status: "error", message: "Token is required" });
      }

      const decoded = await this.service.verifyTokenPassword(token);
      if (!decoded) {
        return res.status(401).json({ status: "error", message: "Invalid or expired token" });
      }

      const result = await this.service.changePassword(decoded.email, currentPassword, newPassword);
      res.status(200).json({ message: result.message });
    } catch (error) {
      next(error);
    }
  };

  // === NUEVO: solicitar reset por email (genera token y envía link) ===
  requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      await this.service.forgotPassword(email); // Debe generar token + enviar correo

      const isApiRequest = req.originalUrl.includes("/api/");
      if (isApiRequest) {
        return res.status(200).json({ status: "success", message: "Si el correo existe, te enviamos un link" });
      }
      res.redirect("/forgot-password?message=" + encodeURIComponent("Te enviamos un link si el correo existe"));
    } catch (error) {
      const isApiRequest = req.originalUrl.includes("/api/");
      if (isApiRequest) {
        return res.status(400).json({ status: "error", message: error.message });
      }
      res.redirect("/forgot-password?error=" + encodeURIComponent(error.message));
    }
  };

 requestPasswordReset = async (req, res) => {
    try {
      const { email } = req.body;
      await this.service.forgotPassword(email);

      const isApi = req.originalUrl.includes('/api/');
      if (isApi) {
        return res.status(200).json({ status: "success", message: "Si el correo existe, te enviamos un link" });
      }
      res.redirect('/forgot-password?message=' + encodeURIComponent('Te enviamos un link si el correo existe'));
    } catch (error) {
      const isApi = req.originalUrl.includes('/api/');
      if (isApi) {
        return res.status(400).json({ status: "error", message: error.message });
      }
      res.redirect('/forgot-password?error=' + encodeURIComponent(error.message));
    }
  };

  // === Reset con token recibido por mail ===
  resetPasswordByToken = async (req, res) => {
    try {
      const { token } = req.query;
      const { newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ status: "error", message: "Token y nueva contraseña son requeridos" });
      }

      await this.service.resetPasswordWithToken(token, newPassword);

      const isApi = req.originalUrl.includes('/api/');
      if (isApi) {
        return res.status(200).json({ status: "success", message: "Contraseña actualizada" });
      }
      res.redirect('/login?message=' + encodeURIComponent('restablecimiento_exitoso'));
    } catch (error) {
      const isApi = req.originalUrl.includes('/api/');
      if (isApi) {
        return res.status(400).json({ status: "error", message: error.message });
      }
      res.redirect('/change-password?token=' + encodeURIComponent(req.query.token || '') + '&error=' + encodeURIComponent(error.message));
    }
  };
}


export const userController = new UserController();

import { createHash, isValidPassword } from "../utils.js";
import Services from "./service.manager.js";
import { userRepository } from "../repository/user.repository.js"; 
import jwt from "jsonwebtoken";
import "dotenv/config";
import { cartService } from "./cart.services.js";
// ⬇️ NUEVO: importá nodemailer arriba del archivo
import nodemailer from "nodemailer";
import crypto from "crypto"; // opcional si luego querés guardar hash del token
import { transporter, gmailChangePasswordConfig } from "../services/email.services.js"; 

class UserService extends Services {
    constructor() {
        super(userRepository); 
    }

    generateToken = (user) => {
        const payload = {
            _id: user._id,
            email: user.email,  // Agrega el correo al payload
            role: user.role  
        };
    
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "20m" });
    };

    getUserByEmail = async (email) => {
        try {
            return await this.dao.getByEmail(email); 
        } catch (error) {
            throw new Error(error);
        }
    };

    register = async (user) => {
        try {
            const { email, password, role } = user; 
            const existUser = await this.getUserByEmail(email);
            if (existUser) throw new Error("User already exists");
    
            const cartUser = await cartService.createCart();
            const newUser = await this.dao.register({
                ...user,
                email,
                password: createHash(password),
                role: role ? role.toUpperCase() : "USER", 
                cart: cartUser._id 
            });
    
            return newUser; 
        } catch (error) {
            throw error;
        }
    };
    

login = async (user) => {
    try {
        const { email, password } = user;
        const userExist = await this.getUserByEmail(email);

        console.log('Usuario encontrado:', userExist);
        console.log('Contraseña guardada (hasheada):', userExist.password);

        if (!userExist) {
            console.log('Usuario no encontrado.');
            throw new Error("User not found");
        }

        const passValid = isValidPassword(password, userExist); // 👈 acá pasa el objeto entero
        console.log('¿La contraseña es válida?', passValid);

        if (!passValid) {
            console.log('Credenciales incorrectas.');
            throw new Error("incorrect credentials");
        }

        console.log('Credenciales correctas. Generando token...');
        return this.generateToken(userExist);
    } catch (error) {
        throw error;
    }
};
privateData = async (user) => {
  try {
    return this.dao.getByEmail(user); // <- estaba this.this.dao
  } catch (error) {
    throw new Error(error);
  }
}

    async verifyTokenPassword(token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            return decoded; 
        } catch (error) {
            return null; 
        }
    }

   async  generateTokenPassword(email) {
        try {
            
            const token = jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: '1h' });
            return token;
        } catch (error) {
            throw new Error("Error generating token: " + error.message);
        }
    }

    async changePassword(email, currentPassword, newPassword) {
        try {
            const user = await this.dao.getByEmail(email); 
            if (!user) {
                throw new Error("User not found");
            }

            const isSamePassword = isValidPassword(currentPassword, user);
            if (!isSamePassword) {
                throw new Error("Current password is incorrect");
            }

            const isNewPasswordSame = isValidPassword(newPassword, user);
            if (isNewPasswordSame) {
                throw new Error("New password cannot be the same as the current one");
            }

            const hashedPassword = createHash(newPassword);
            user.password = hashedPassword;

            const updatedUser = await this.dao.changeUserPassword(user); 

            return { status: "success", message: "Password updated successfully", payload: updatedUser };
        } catch (error) {
            throw new Error(error.message);
        }
    }

forgotPassword = async (email) => {
  const token = jwt.sign({ email }, process.env.SECRET_KEY, { expiresIn: "1h" });
  const resetLink = `${process.env.BASE_URL}/change-password?token=${token}`; // ✅ sin /user

  const mailOptions = gmailChangePasswordConfig(resetLink, email);
  await transporter.sendMail(mailOptions);
  return true;
};

resetPasswordWithToken = async (token, newPassword) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_KEY);
  } catch {
    throw new Error("Token inválido o expirado");
  }

  const user = await this.getUserByEmail(decoded.email);
  if (!user) throw new Error("User not found");

  const isSame = isValidPassword(newPassword, user);
  if (isSame) throw new Error("La nueva contraseña no puede ser igual a la actual");

  user.password = createHash(newPassword);
  await this.dao.changeUserPassword(user);

  return true;
};


}



export const userService = new UserService();
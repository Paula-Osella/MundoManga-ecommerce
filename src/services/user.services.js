import { createHash, isValidPassword } from "../utils.js";
import Services from "./service.manager.js";
import { userRepository } from "../repository/user.repository.js"; 
import jwt from "jsonwebtoken";
import "dotenv/config";
import { cartService } from "./cart.services.js";

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
            if (!userExist) throw new Error("User not found");
            const passValid = isValidPassword(password, userExist);
            if (!passValid) throw new Error("incorrect credentials");
            return this.generateToken(userExist); 
        } catch (error) {
            throw error;
        }
    };
    privateData= async (user)=>{
        try {
            return this.this.dao.getByEmail(user)
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
}



export const userService = new UserService();
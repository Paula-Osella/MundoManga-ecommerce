import { UserModel } from "../models/user.model.js";
import MongoDao from "./mongo.dao.js";

class UserDaoMongo extends MongoDao {
    constructor() {
        super(UserModel)
    }

    async register(user) {
        try {
            return await this.model.create(user);
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(id) {
        try {
            return await this.model.findById(id).populate("cart");
        } catch (error) {
            throw new Error(error);
        }
    }

    async getByEmail(email) {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            throw new Error(error);
        }
    }
    async saveUser(user){
        try {
            return await user.save()
        } catch (error) {
            throw new Error("Error while saving the user")
        }
    }
    async changeUserPassword(user) {
        try {
            
            const updatedUser = await this.model.findByIdAndUpdate(
                user._id,
                { password: user.password },
                { new: true } 
            );
            return updatedUser;
        } catch (error) {
            throw new Error("Error updating password: " + error.message);
        }
    }
}

export const userDao = new UserDaoMongo();

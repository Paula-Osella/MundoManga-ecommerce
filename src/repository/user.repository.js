import { userDao } from "../daos/mongodb/user.dao.js";
import { UserDTO } from "../dtos/userdto.js";
import { UserModel } from "../daos/models/user.model.js";
class UserRepository {
    constructor() {
        this.dao = userDao;
    }
    register = async (user) => {
        const createdUser = await userDao.register(user);
        return new UserDTO(createdUser);
    };

    getByEmail = async (email) => {
        return await userDao.getByEmail(email); 
    };
    
    getById = async (id) => {
        return await userDao.getByEmail(id); 
    };
    async changeUserPassword(user) {
        try {
            
            const updatedUser = await UserModel.findByIdAndUpdate(
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


export const userRepository = new UserRepository();
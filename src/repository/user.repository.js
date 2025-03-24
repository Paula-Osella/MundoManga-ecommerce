import { userDao } from "../daos/mongodb/user.dao.js";
import { UserDTO } from "../dtos/userdto.js";

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
        return await userDao.getById(id); 
    };
}


export const userRepository = new UserRepository();
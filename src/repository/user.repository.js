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
    async changeUserPassword (user){
        try {
            let response = await this.dao.saveUser(user)
            return new UserOutputDTO(response)
        } catch (error) {
            throw new Error(e)
        }
    }

}


export const userRepository = new UserRepository();
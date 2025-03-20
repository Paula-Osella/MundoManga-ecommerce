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

    getById = async (id) => {
        const user = await userDao.getById(id);
        return new UserDTO(user);
    };

    getByEmail = async (email) => {
        const user = await userDao.getByEmail(email);
        return user ? new UserDTO(user) : null;
    };
}


export const userRepository = new UserRepository();
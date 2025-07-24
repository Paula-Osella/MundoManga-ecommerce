import { userDao } from "../daos/mongodb/user.dao.js";
import { UserDTO } from "../dtos/userdto.js";
import { UserModel } from "../daos/models/user.model.js";
import { logger } from '../config/logger.js';

class UserRepository {
    constructor() {
        this.dao = userDao;
        logger.info('Instancia de UserRepository creada.');
    }

    register = async (user) => {
        try {
            logger.debug('Iniciando registro de usuario en el DAO con datos:', user); 
            const createdUser = await userDao.register(user);
            logger.info(`Usuario registrado en el DAO con ID: ${createdUser._id}`); 
            return new UserDTO(createdUser);
        } catch (error) {
            logger.error('Error en UserRepository al registrar usuario:', error); 
            throw error; 
        }
    };

    getByEmail = async (email) => {
        try {
            logger.debug(`Buscando usuario por email: ${email} en el DAO.`); 
            const user = await userDao.getByEmail(email);
            if (!user) {
                logger.warn(`Usuario no encontrado en el DAO con email: ${email}`); 
            } else {
                logger.info(`Usuario encontrado en el DAO con email: ${email}`); 
            }
            return user;
        } catch (error) {
            logger.error(`Error en UserRepository al obtener usuario por email ${email}:`, error); 
            throw error;
        }
    };

    getById = async (id) => {
        try {
            logger.debug(`Buscando usuario por ID: ${id} en el DAO.`); 
            const user = await userDao.getByEmail(id);
            if (!user) {
                logger.warn(`Usuario no encontrado en el DAO con ID: ${id}`);
            } else {
                logger.info(`Usuario encontrado en el DAO con ID: ${id}`); 
            }
            return user;
        } catch (error) {
            logger.error(`Error en UserRepository al obtener usuario por ID ${id}:`, error); 
            throw error;
        }
    };

    async changeUserPassword(user) {
        try {
            logger.debug(`Iniciando cambio de contraseña para usuario ID: ${user._id}`); 

            const updatedUser = await UserModel.findByIdAndUpdate(
                user._id,
                { password: user.password },
                { new: true }
            );
            if (!updatedUser) {
                logger.warn(`Usuario no encontrado para cambiar contraseña con ID: ${user._id}`); 
            } else {
                logger.info(`Contraseña de usuario ID: ${user._id} actualizada en la base de datos.`); 
            }
            return updatedUser;
        } catch (error) {
            logger.error(`Error en UserRepository al cambiar la contraseña del usuario ${user._id || 'N/A'}:`, error); 
            throw new Error("Error updating password: " + error.message);
        }
    }
}

export const userRepository = new UserRepository();
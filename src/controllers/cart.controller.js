import { cartService } from "../services/cart.services.js";
import CartOutputDTO from "../dtos/cart.output.dto.js";
import { logger } from '../config/logger.js';


export const cartController = {

    createCart: async (req, res) => {
        try {
            logger.info('Intentando crear un nuevo carrito'); 
            const cart = await cartService.createCart();
            logger.info(`Carrito creado con éxito: ${cart._id}`); 
            res.status(201).json({ message: "Carrito creado con éxito", cart });
        } catch (error) {
            logger.error('Error al crear el carrito:', error); // Log de error
            res.status(500).json({ message: "Error al crear el carrito", error: error.message });
        }
    },

    getCartById: async (req, res) => {
        try {
            const { cartId } = req.params;
            logger.debug(`Intentando obtener carrito con ID: ${cartId}`); 
            
            const cart = await cartService.getById(cartId);
            if (!cart) {
                logger.warn(`Carrito no encontrado con ID: ${cartId}`); 
                return res.status(404).json({ message: "Carrito no encontrado" });
            }
            logger.info(`Carrito obtenido con éxito para ID: ${cartId}`); 
            res.status(200).json(cart);
        } catch (error) {
            
            logger.error(`Error al obtener el carrito con ID ${req.params.cartId}:`, error); 
            res.status(500).json({ message: error.message });
        }
    },

    getAllCarts: async (req, res) => {
        try {
            logger.info('Intentando obtener todos los carritos'); 
            const carts = await cartService.getAllCarts();
            logger.info(`Se obtuvieron ${carts.length} carritos.`); 
            res.status(200).json(carts);
        } catch (error) {
            logger.error('Error al obtener todos los carritos:', error); 
            res.status(500).json({ message: "Error al obtener los carritos", error: error.message });
        }
    },

    addProdToCart: async (req, res) => {
        const { cartId, prodId } = req.params;
        try {
            logger.debug(`Intentando agregar producto ${prodId} al carrito ${cartId}`); 
            const updatedCart = await cartService.addProdToCart(cartId, prodId);
            logger.info(`Producto ${prodId} agregado al carrito ${cartId} con éxito.`); 
            res.status(200).json({ message: "Producto agregado al carrito", updatedCart });
        } catch (error) {
            logger.error(`Error al agregar producto ${prodId} al carrito ${cartId}:`, error); 
            res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
        }
    },


    removeProdFromCart: async (req, res) => {
        const { cartId, prodId } = req.params;
        try {
            logger.debug(`Intentando eliminar producto ${prodId} del carrito ${cartId}`); 
            const updatedCart = await cartService.removeProdFromCart(cartId, prodId);
            logger.info(`Producto ${prodId} eliminado del carrito ${cartId} con éxito.`);
            res.status(200).json({ message: "Producto eliminado del carrito", updatedCart });
        } catch (error) {
            logger.error(`Error al eliminar producto ${prodId} del carrito ${cartId}:`, error); 
            res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
        }
    },


    updateProdQuantityToCart: async (req, res) => {
        const { cartId, prodId } = req.params;
        const { quantity } = req.body;
        try {
            logger.debug(`Intentando actualizar cantidad de producto ${prodId} en carrito ${cartId} a ${quantity}`); 
            const updatedCart = await cartService.updateProdQuantityToCart(cartId, prodId, quantity);
            logger.info(`Cantidad de producto ${prodId} en carrito ${cartId} actualizada con éxito.`); 
            res.status(200).json({ message: "Cantidad del producto actualizada", updatedCart });
        } catch (error) {
            logger.error(`Error al actualizar cantidad de producto ${prodId} en carrito ${cartId}:`, error); 
            res.status(500).json({ message: "Error al actualizar la cantidad", error: error.message });
        }
    },


    clearCart: async (req, res) => {
        const { cartId } = req.params;
        try {
            logger.debug(`Intentando limpiar carrito con ID: ${cartId}`); 
            const updatedCart = await cartService.clearCart(cartId);
            logger.info(`Carrito ${cartId} limpiado con éxito.`); 
            res.status(200).json({ message: "Carrito limpio", updatedCart });
        } catch (error) {
            logger.error(`Error al limpiar el carrito ${cartId}:`, error);
            res.status(500).json({ message: "Error al limpiar el carrito", error: error.message });
        }
    },

    completePurchase: async (req, res, next) => {
        try {
            const { cartId } = req.params;
            const user = req.user;
            const userEmail = user.email;
            logger.info(`Iniciando proceso de compra para carrito ${cartId} por el usuario ${userEmail}`); 

            const result = await cartService.completePurchase(cartId, userEmail);
            logger.info(`Compra completada exitosamente para carrito ${cartId}. Ticket: ${result.ticketId}`); 

            res.status(200).json(result);
        } catch (error) {
            logger.error(`Error al completar la compra para carrito ${req.params.cartId}:`, error); 
            next(error); 
        }
    }

};
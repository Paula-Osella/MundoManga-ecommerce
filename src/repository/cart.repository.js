// repositories/cart.repository.js
import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import CartModel from '../daos/models/cart.model.js';
import ProductModel from "../daos/models/product.model.js";
import { logger } from '../config/logger.js';

export default class CartRepository {
    constructor() {
        this.dao = new CartDaoMongoDB();
        logger.info('Instancia de CartRepository creada.'); 
    }

    async createCart() {
        try {
            logger.debug('Iniciando creación de carrito a través del DAO.'); 
            const newCart = await this.dao.create();
            logger.info(`Carrito creado en DAO con ID: ${newCart._id}`); 
            return newCart;
        } catch (error) {
            logger.error('Error en CartRepository al crear carrito:', error); 
            throw error; 
        }
    }

    async getById(cartId) {
        try {
            logger.debug(`Buscando carrito con ID: ${cartId} a través del DAO.`); 
            const cart = await this.dao.getById(cartId);
            if (!cart) {
                logger.warn(`Carrito no encontrado en DAO con ID: ${cartId}`); 
            } else {
                logger.info(`Carrito encontrado en DAO con ID: ${cartId}`); 
            }
            return cart;
        } catch (error) {
            logger.error(`Error en CartRepository al obtener carrito por ID ${cartId}:`, error); 
            throw error;
        }
    }

    async getAllCarts() {
        try {
            logger.debug('Buscando todos los carritos a través del DAO.'); 
            const carts = await this.dao.getAll();
            logger.info(`Se obtuvieron ${carts.length} carritos del DAO.`); 
            return carts;
        } catch (error) {
            logger.error('Error en CartRepository al obtener todos los carritos:', error); 
            throw error;
        }
    }

    async addProdToCart(cartId, prodId) {
        try {
            logger.debug(`Iniciando adición de producto ${prodId} al carrito ${cartId} en el repositorio.`); 

            const cart = await CartModel.findById(cartId);
            if (!cart) {
                logger.warn(`Carrito no encontrado (addProdToCart) con ID: ${cartId}`); 
                throw new Error('Carrito no encontrado');
            }
            logger.debug(`Carrito ${cartId} encontrado.`);

            const product = await ProductModel.findById(prodId);
            if (!product) {
                logger.warn(`Producto no encontrado (addProdToCart) con ID: ${prodId}`); 
                throw new Error('Producto no encontrado');
            }
            logger.debug(`Producto ${prodId} encontrado.`);


            const productInCart = cart.products.find(item => item.product.toString() === prodId);

            if (productInCart) {
                productInCart.quantity += 1;
                logger.debug(`Cantidad de producto ${prodId} incrementada en carrito ${cartId}. Nueva cantidad: ${productInCart.quantity}`); 
            } else {
                cart.products.push({ product: product._id, quantity: 1 });
                logger.debug(`Producto ${prodId} añadido por primera vez al carrito ${cartId}.`); 
            }

            await cart.save();
            logger.info(`Producto ${prodId} agregado/actualizado en carrito ${cartId} y guardado.`); 

            return cart;
        } catch (error) {
            logger.error(`Error en CartRepository al agregar el producto ${prodId} al carrito ${cartId}:`, error);
            throw new Error("Error al agregar el producto al carrito: " + error.message);
        }
    }

    async removeProdFromCart(cartId, prodId) {
        try {
            logger.debug(`Iniciando eliminación de producto ${prodId} del carrito ${cartId} a través del DAO.`); 
            const updatedCart = await this.dao.removeProdToCart(cartId, prodId);
            logger.info(`Producto ${prodId} eliminado del carrito ${cartId} en DAO.`);
            return updatedCart;
        } catch (error) {
            logger.error(`Error en CartRepository al eliminar producto ${prodId} del carrito ${cartId}:`, error); 
            throw error;
        }
    }

async updateProdQuantityToCart(cartId, prodId, quantity) {
  try {
    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 0) {
      throw new Error('Cantidad inválida');
    }

    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error('Carrito no encontrado');

    // Buscar el producto en el carrito (comparando como string)
    const productInCart = cart.products.find(
      (item) => String(item.product) === String(prodId)
    );

    if (!productInCart) {
      // UP SERT: si no existe y qty > 0, lo agregamos
      if (qty > 0) {
        cart.products.push({ product: prodId, quantity: qty });
      }
      // si qty === 0 y no existe, no hacemos nada
    } else {
      if (qty === 0) {
        // qty = 0 => lo removemos
        cart.products = cart.products.filter(
          (item) => String(item.product) !== String(prodId)
        );
      } else {
        productInCart.quantity = qty;
      }
    }

    await cart.save();
    return cart;
  } catch (error) {
    throw new Error(
      'Error al actualizar la cantidad del producto en el carrito: ' + error.message
    );
  }
}

    async clearCart(cartId) {
        try {
            logger.debug(`Iniciando limpieza de carrito ${cartId} a través del DAO.`); 
            const clearedCart = await this.dao.clearCart(cartId);
            logger.info(`Carrito ${cartId} limpiado en DAO.`); 
            return clearedCart;
        } catch (error) {
            logger.error(`Error en CartRepository al limpiar el carrito ${cartId}:`, error); 
            throw error;
        }
    }

    async processPurchase(cartId) {
        try {
            logger.debug(`Iniciando proceso de compra para carrito ${cartId} a través del DAO.`); 
            const purchaseResult = await this.dao.processPurchase(cartId);
            logger.info(`Proceso de compra completado para carrito ${cartId} en DAO.`); 
            return purchaseResult;
        } catch (error) {
            logger.error(`Error en CartRepository al procesar la compra para carrito ${cartId}:`, error); 
            throw error;
        }
    }
}
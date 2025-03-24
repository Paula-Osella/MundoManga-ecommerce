// repositories/cart.repository.js
import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import CartDTO from "../dtos/cartdto.js";

class CartRepository {
    constructor() {
        this.cartDao = new CartDaoMongoDB();
    }

    async createCart() {
        try {
            const newCart = await this.cartDao.create();
            return new CartDTO(newCart); // Devuelvo el DTO con los datos del carrito creado
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await this.cartDao.getById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");
            return new CartDTO(cart); // Retorno el DTO con los datos del carrito
        } catch (error) {
            throw new Error("Error al obtener el carrito");
        }
    }

    async addProductToCart(cartId, prodId) {
        try {
            const updatedCart = await this.cartDao.addProdToCart(cartId, prodId);
            return new CartDTO(updatedCart); // Retorno el carrito actualizado como DTO
        } catch (error) {
            throw new Error("Error al agregar producto al carrito");
        }
    }

    async removeProductFromCart(cartId, prodId) {
        try {
            const updatedCart = await this.cartDao.removeProdToCart(cartId, prodId);
            return new CartDTO(updatedCart); // Retorno el carrito actualizado como DTO
        } catch (error) {
            throw new Error("Error al remover producto del carrito");
        }
    }

    async updateProductQuantity(cartId, prodId, quantity) {
        try {
            const updatedCart = await this.cartDao.updateProdQuantityToCart(cartId, prodId, quantity);
            return new CartDTO(updatedCart); // Retorno el carrito actualizado como DTO
        } catch (error) {
            throw new Error("Error al actualizar cantidad del producto en el carrito");
        }
    }

    async clearCart(cartId) {
        try {
            const clearedCart = await this.cartDao.clearCart(cartId);
            return new CartDTO(clearedCart); // Retorno el carrito vacío como DTO
        } catch (error) {
            throw new Error("Error al vaciar el carrito");
        }
    }
}

export const cartRepository = new CartRepository();

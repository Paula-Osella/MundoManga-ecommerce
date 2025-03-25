// repositories/cart.repository.js
import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import CartDTO from "../dtos/cartdto.js";
import {ProductModel} from '../daos/models/product.model.js';
import CartModel from "../daos/models/cart.model.js";

class CartRepository {
    constructor() {
        this.cartDao = new CartDaoMongoDB();
    }

    async createCart() {
        try {
            const newCart = await this.cartDao.create();
            return new CartDTO(newCart);  // Retorna un DTO con los datos del carrito creado
        } catch (error) {
            throw new Error("Error al crear el carrito");
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await this.cartDao.getById(cartId);
            if (!cart) throw new Error("Carrito no encontrado");
            return new CartDTO(cart);  // Retorna un DTO con los datos del carrito
        } catch (error) {
            throw new Error("Error al obtener el carrito");
        }
    }

    async addProductToCart(cartId, prodId) {
        try {
            // Buscar el carrito por ID
            const cart = await CartModel.findById(cartId);  // Usar el modelo Cart para obtener el carrito

            // Buscar el producto por ID
            const product = await ProductModel.findById(prodId);  // Usar el modelo Product para obtener el producto

            if (!product) throw new Error("Producto no encontrado");

            // Aquí puedes manejar la lógica de agregar el producto al carrito
            cart.products.push(product._id);  // Suponiendo que tienes un arreglo de productos en el carrito
            await cart.save();

            return new CartDTO(cart);  // Retorna el carrito actualizado como DTO
        } catch (error) {
            throw new Error("Error al agregar producto al carrito");
        }
    }

    async removeProductFromCart(cartId, prodId) {
        try {
            const cart = await CartModel.findById(cartId);  // Buscar el carrito por ID

            if (!cart) throw new Error("Carrito no encontrado");

            // Eliminar el producto del carrito
            cart.products = cart.products.filter(productId => productId.toString() !== prodId);

            await cart.save();
            return new CartDTO(cart);  // Retorna el carrito actualizado como DTO
        } catch (error) {
            throw new Error("Error al remover producto del carrito");
        }
    }

    async updateProductQuantity(cartId, prodId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);  // Buscar el carrito por ID
            if (!cart) throw new Error("Carrito no encontrado");

            // Aquí puedes agregar lógica para actualizar la cantidad del producto

            // Retorna el carrito actualizado como DTO
            return new CartDTO(cart); 
        } catch (error) {
            throw new Error("Error al actualizar cantidad del producto en el carrito");
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await CartModel.findById(cartId);  // Buscar el carrito por ID
            if (!cart) throw new Error("Carrito no encontrado");

            cart.products = [];  // Vaciar el carrito
            await cart.save();

            return new CartDTO(cart);  // Retorna el carrito vacío como DTO
        } catch (error) {
            throw new Error("Error al vaciar el carrito");
        }
    }
}

export default CartRepository;
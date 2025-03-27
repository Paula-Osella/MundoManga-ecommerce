// repositories/cart.repository.js
import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import CartModel from '../daos/models/cart.model.js';
import ProductModel from "../daos/models/product.model.js";

export default class CartRepository {
    constructor() {
        this.dao = new CartDaoMongoDB();
    }

    async createCart() {
        return await this.dao.create();
    }

    async getById(cartId) {
        return await this.dao.getById(cartId);
    }

    async getAllCarts() {
        return await this.dao.getAll();
    }

    async addProdToCart(cartId, prodId) {
        try {
            // Obtener el carrito por su ID
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');
    
            // Buscar el producto por su ID
            const product = await ProductModel.findById(prodId);
            if (!product) throw new Error('Producto no encontrado');
    
            // Verificar si el producto ya está en el carrito
            const productInCart = cart.products.find(item => item.product.toString() === prodId);
            
            if (productInCart) {
                // Si el producto ya está, incrementamos la cantidad
                productInCart.quantity += 1;
            } else {
                // Si no está, lo agregamos con cantidad 1
                cart.products.push({ product: product._id, quantity: 1 });
            }
    
            // Guardar los cambios en el carrito
            await cart.save();
            
            // Retornamos el carrito actualizado
            return cart;
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito: " + error.message);
        }
    }
    

    async removeProdFromCart(cartId, prodId) {
        return await this.dao.removeProdToCart(cartId, prodId);
    }

    async updateProdQuantityToCart(cartId, prodId, quantity) {
        try {
            const cart = await CartModel.findById(cartId);
            if (!cart) throw new Error('Carrito no encontrado');
    
            // Buscar el producto en el carrito
            const productInCart = cart.products.find(item => item.product.toString() === prodId);
            if (!productInCart) throw new Error('Producto no encontrado en el carrito');
    
            // Actualizar la cantidad
            productInCart.quantity = quantity;
    
            // Guardar los cambios en el carrito
            await cart.save();
            
            return cart;
        } catch (error) {
            throw new Error("Error al actualizar la cantidad del producto en el carrito: " + error.message);
        }
    }
    

    async clearCart(cartId) {
        return await this.dao.clearCart(cartId);
    }
    async processPurchase(cartId) {
        return await this.dao.processPurchase(cartId);
    }
    
}

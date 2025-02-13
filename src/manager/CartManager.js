
import CartModel from '../models/cart.model.js';
import ProductModel from "../models/product.model.js";
import mongoose from 'mongoose';

class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] }); 
            await newCart.save();
            console.log('Carrito creado con éxito:', newCart);
            return newCart;
        } catch (error) {
            console.error("Error al crear el carrito:", error);
            throw new Error("Error al crear el carrito");
        }
    }
    
    

    async addProductToCart(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            throw new Error('ID de producto no válido');
        }
    
        const existingProduct = cart.products.find(p => p.product.toString() === productId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
    
        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        // Buscar el carrito y hacer populate para obtener los productos completos
        const cart = await CartModel.findById(cartId).populate('products.product'); 
    
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        console.log('Buscando producto con ID:', productId);
        console.log('Productos en el carrito:', cart.products.map(p => p.product._id.toString()));
    
        // Comparar asegurando que la comparación sea con el tipo adecuado
        const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId.toString());
    
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }
    
        // Eliminar el producto del carrito y guardar los cambios
        cart.products.splice(productIndex, 1);
        await cart.save();
        return cart;
    }
    
    

    async getCartById(cartId) {
        const cart = await CartModel.findById(cartId).populate('products.product'); 
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const product = cart.products.find(p => p.product.toString() === productId);
        if (!product) {
            throw new Error('Producto no encontrado en el carrito');
        }

        product.quantity = quantity;
        await cart.save();
        return cart;
    }
}

export default CartManager;

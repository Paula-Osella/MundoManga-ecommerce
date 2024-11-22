import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 

const cartsFilePath = path.resolve('data', 'carts.json');


class CartManager {
    constructor() {
        this.carts = [];
        this.loadCartsFromFile();
    }

    async loadCartsFromFile() {
        try {
            if (fs.existsSync(cartsFilePath)) {
                const data = await fs.promises.readFile(cartsFilePath, 'utf-8');
                this.carts = JSON.parse(data);
            } else {
                this.carts = [];
            }
        } catch (error) {
            console.error('Error al cargar los carritos:', error);
        }
    }

    async saveCartsToFile() {
        try {
            await fs.promises.writeFile(cartsFilePath, JSON.stringify(this.carts, null, 2));
        } catch (error) {
            console.error('Error al guardar los carritos:', error);
        }
    }

    async cleanCarts() {
        this.carts.forEach(cart => {
            cart.products.forEach(product => {
                product.productId = product.productId.trim(); 
            });
        });
        await this.saveCartsToFile();
    }
    
    async loadProductsFromFile() {
        try {
            if (fs.existsSync(productsFilePath)) {
                const data = await fs.promises.readFile(productsFilePath, 'utf-8');
                this.products = JSON.parse(data);
            } else {
                this.products = [];
            }
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
    }

    async createCart() {
        const newCart = {
            id: uuidv4(), // ID único generado
            products: [], // Inicialmente vacío
        };
        this.carts.push(newCart);
        await this.saveCartsToFile();
        return newCart;
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        const cleanProductId = productId.trim();
        const existingProduct = cart.products.find(product => product.productId === cleanProductId);
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId: cleanProductId, quantity });
        }
    
        await this.saveCartsToFile();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        const productIndex = cart.products.findIndex(product => product.productId === productId);
        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        cart.products.splice(productIndex, 1);
        await this.saveCartsToFile();
        return cart;
    }

    async removeCart(cartId) {
        const cartIndex = this.carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error('Carrito no encontrado');
        }
    
        const deletedCart = this.carts[cartIndex];
        this.carts.splice(cartIndex, 1);
        await this.saveCartsToFile();

        return { message: 'Carrito eliminado correctamente', cart: deletedCart };
    }

    async getCartById(cartId) {
        const cart = this.carts.find(cart => cart.id === cartId);
        return cart || null; 
    }
}

export default CartManager;

import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 

const cartsFilePath = path.resolve('data', 'carts.json');


class CartManager {
    constructor() {
        this.carts = [];
        this.loadCartsFromFile();

    }

    // Cargar carritos desde el archivo JSON
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

    // Guardar carritos en el archivo JSON
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
    // Crear un carrito para un usuario
    async createCart(userData) {
        const newCart = {
            id: uuidv4(), // ID único generado
            user: userData,
            products: [],
        };
        this.carts.push(newCart);
        await this.saveCartsToFile();
        return newCart;
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productId, quantity) {
        const cart = this.carts.find(cart => cart.id === cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
    
        // Limpiar el productId para evitar espacios o saltos de línea
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

// Eliminar un producto del carrito
async removeProductFromCart(cartId, productId) {
    const cart = this.carts.find(cart => cart.id === cartId);
    if (!cart) {
        throw new Error('Carrito no encontrado');
    }

    const productIndex = cart.products.findIndex(product => product.productId === productId);
    if (productIndex === -1) {
        throw new Error('Producto no encontrado en el carrito');
    }

    // Eliminar el producto
    cart.products.splice(productIndex, 1);
    await this.saveCartsToFile();
    return cart; // Retorna el carrito actualizado
}

}

export default CartManager;


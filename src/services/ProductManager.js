import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const productosFilePath = path.resolve('data', 'products.json');

export default class ProductManager {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        try {
            const data = await fs.readFile(productosFilePath, 'utf-8');
            this.products = JSON.parse(data);
        } catch (error) {
            this.products = [];
        }
    }

    async getAllProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        }
        return this.products;
    }

    async saveToFile() {
        const jsonData = JSON.stringify(this.products, null, 2);
        await fs.writeFile(productosFilePath, jsonData);
    }

    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    async addProduct(product) {
        const newProduct = {
            id: uuidv4(),
            ...product,
            status: true,
        };

        this.products.push(newProduct);
        // Guardar los cambios en el archivo
        await this.saveToFile();

        return newProduct;
    }

    // Actualizar producto
    async updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;

        const updatedProduct = {
            ...this.products[productIndex],
            ...updatedFields,
            id: this.products[productIndex].id,
        };


        this.products[productIndex] = updatedProduct;
        this.saveToFile()
        return updatedProduct;
    }

    // Eliminar producto
    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex === -1) return null;

        const deletedProduct = this.products.splice(productIndex, 1);
        this.saveToFile()
        return deletedProduct[0];

    }
}




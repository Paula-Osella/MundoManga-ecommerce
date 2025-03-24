// repositories/product.repository.js
import { ProductModel } from "../daos/models/product.model.js";

export class ProductRepository {
    // Obtener todos los productos
    async getAll() {
        try {
            return await ProductModel.find({});
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    // Crear un producto
    async create(productData) {
        try {
            const newProduct = new ProductModel(productData);
            return await newProduct.save();
        } catch (error) {
            throw new Error('Error al crear el producto: ' + error.message);
        }
    }

    // Obtener un producto por ID
    async getById(productId) {
        try {
            return await ProductModel.findById(productId);
        } catch (error) {
            throw new Error('Error al obtener el producto por ID: ' + error.message);
        }
    }

    // Actualizar un producto
    async update(productId, productData) {
        try {
            return await ProductModel.findByIdAndUpdate(productId, productData, { new: true });
        } catch (error) {
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }

    // Eliminar un producto
    async delete(productId) {
        try {
            return await ProductModel.findByIdAndDelete(productId);
        } catch (error) {
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }
}

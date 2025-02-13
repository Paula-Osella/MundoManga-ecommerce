import ProductModel from "../models/product.model.js";
import mongoose from 'mongoose';

class ProductManager {


    async getAllProducts({ limit = 10, page = 1, sort = 'asc', query = {} }) {
        try {

            const options = {
                page,
                limit,
                sort: { price: sort === 'asc' ? 1 : -1 },
                lean: true,
            };


            const result = await ProductModel.paginate(query, options);


            return {
                status: 'success',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${JSON.stringify(query)}` : null,
                nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${JSON.stringify(query)}` : null
            };
        } catch (error) {
            console.error('Error al obtener productos', error);
            throw new Error('Error al obtener productos');
        }
    }


    async getProductById(id) {
        try {
            const product = await ProductModel.findById(id);
            if (!product) throw new Error('Producto no encontrado');
            return product;
        } catch (error) {
            throw new Error('Producto no encontrado');
        }
    }


    async getProductsByCategory(categoryName) {
        try {
            const products = await ProductModel.find({ category: categoryName });
            return products;
        } catch (error) {
            console.error('Error al obtener productos por categoría', error);
            throw new Error('Error al obtener productos por categoría');
        }
    }


    async addProduct(productData) {
        try {
            const newProduct = new ProductModel(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
            if (error.name === 'ValidationError') {
                throw new Error(`Error de validación: ${error.message}`);
            }
            throw new Error('Error al agregar producto');
        }
    }


    async updateProduct(id, updatedFields) {
        try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('ID de producto no válido');
            }

            const updatedProduct = await ProductModel.findByIdAndUpdate(id, updatedFields, { new: true });
            if (!updatedProduct) {
                throw new Error('Producto no encontrado');
            }

            return updatedProduct;
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            throw new Error(error.message);
        }
    }



    async deleteProduct(id) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(id);
            if (!deletedProduct) throw new Error('Producto no encontrado');
            return deletedProduct;
        } catch (error) {
            console.error('Error al eliminar producto', error);
            throw new Error('Error al eliminar producto');
        }
    }
}


export default new ProductManager(); 
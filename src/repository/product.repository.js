// repositories/product.repository.js
import { ProductModel } from "../daos/models/product.model.js";
import { logger } from '../config/logger.js';

export class ProductRepository {
    constructor() {
        logger.info('Instancia de ProductRepository creada.');
    }

    async getAll() {
        try {
            logger.debug('Iniciando obtención de todos los productos desde la base de datos.'); 
            const products = await ProductModel.find({});
            logger.info(`Se obtuvieron ${products.length} productos de la base de datos.`); 
            return products;
        } catch (error) {
            logger.error('Error en ProductRepository al obtener todos los productos:', error); 
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    async create(productData) {
        try {
            logger.debug('Iniciando creación de producto en la base de datos con datos:', productData);
            const newProduct = new ProductModel(productData);
            const savedProduct = await newProduct.save();
            logger.info(`Producto creado en la base de datos con ID: ${savedProduct._id}`); 
            return savedProduct;
        } catch (error) {
            logger.error('Error en ProductRepository al crear el producto:', error);
            throw new Error('Error al crear el producto: ' + error.message);
        }
    }

    async getById(productId) {
        try {
            logger.debug(`Buscando producto con ID: ${productId} en la base de datos.`); 
            const product = await ProductModel.findById(productId);
            if (!product) {
                logger.warn(`Producto no encontrado en la base de datos con ID: ${productId}`); 
            } else {
                logger.info(`Producto encontrado en la base de datos con ID: ${productId}`); 
            }
            return product;
        } catch (error) {
            logger.error(`Error en ProductRepository al obtener el producto por ID ${productId}:`, error); 
            throw new Error('Error al obtener el producto por ID: ' + error.message);
        }
    }

    async update(productId, productData) {
        try {
            logger.debug(`Iniciando actualización de producto ${productId} en la base de datos con datos:`, productData); 
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, productData, { new: true });
            if (!updatedProduct) {
                logger.warn(`Producto no encontrado en la base de datos para actualizar con ID: ${productId}`);
            } else {
                logger.info(`Producto ${productId} actualizado en la base de datos.`); 
            }
            return updatedProduct;
        } catch (error) {
            logger.error(`Error en ProductRepository al actualizar el producto ${productId}:`, error); 
            throw new Error('Error al actualizar el producto: ' + error.message);
        }
    }

    async delete(productId) {
        try {
            logger.debug(`Iniciando eliminación de producto con ID: ${productId} de la base de datos.`); 
            const deletedProduct = await ProductModel.findByIdAndDelete(productId);
            if (!deletedProduct) {
                logger.warn(`Producto no encontrado en la base de datos para eliminar con ID: ${productId}`); 
            } else {
                logger.info(`Producto ${productId} eliminado de la base de datos.`); 
            }
            return deletedProduct;
        } catch (error) {
            logger.error(`Error en ProductRepository al eliminar el producto ${productId}:`, error); 
            throw new Error('Error al eliminar el producto: ' + error.message);
        }
    }
}

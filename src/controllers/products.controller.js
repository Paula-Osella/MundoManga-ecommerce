// controllers/product.controller.js
import { productService } from "../services/product.services.js";
import { logger } from '../config/logger.js'; 

export const getAllProducts = async (req, res) => {
    try {
        logger.info('Intentando obtener todos los productos'); 
        const products = await productService.getAll();
        logger.info(`Se obtuvieron ${products.length} productos.`); 
        res.status(200).json(products);
    } catch (error) {
        logger.error('Error al obtener todos los productos:', error); 
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        logger.debug(`Intentando obtener producto con ID: ${pid}`); 
        const product = await productService.getById(pid);
        if (!product) {
            logger.warn(`Producto no encontrado con ID: ${pid}`); 
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        logger.info(`Producto obtenido con éxito para ID: ${pid}`); 
        res.status(200).json(product);
    } catch (error) {
        logger.error(`Error al obtener producto con ID ${req.params.pid}:`, error); 
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        logger.info('Intentando crear un nuevo producto'); 
        logger.debug('Datos del nuevo producto:', req.body); 
        const newProduct = await productService.create(req.body);
        logger.info(`Producto creado con éxito. ID: ${newProduct._id}`); 
        res.status(201).json(newProduct);
    } catch (error) {
        logger.error('Error al crear el producto:', error); 
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        logger.debug(`Intentando actualizar producto con ID: ${pid}`); 
        logger.debug('Datos de actualización:', req.body); 
        const updatedProduct = await productService.update(pid, req.body);
        if (!updatedProduct) {
            logger.warn(`Producto no encontrado para actualizar con ID: ${pid}`); 
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        logger.info(`Producto actualizado con éxito. ID: ${pid}`); 
        res.status(200).json(updatedProduct);
    } catch (error) {
        logger.error(`Error al actualizar producto con ID ${req.params.pid}:`, error); 
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        logger.info(`Intentando eliminar producto con ID: ${pid}`); 
        const deletedProduct = await productService.delete(pid);
        if (!deletedProduct) {
            logger.warn(`Producto no encontrado para eliminar con ID: ${pid}`); 
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        logger.info(`Producto eliminado exitosamente. ID: ${pid}`);
        res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        logger.error(`Error al eliminar producto con ID ${req.params.pid}:`, error); 
        res.status(500).json({ error: error.message });
    }
};
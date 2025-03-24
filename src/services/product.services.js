import Services from "./service.manager.js";
import { productDao } from "../daos/mongodb/product.dao.js";
import { ProductRepository } from "../repository/product.repository.js";

class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  // Obtener todos los productos
  async getAll() {
    try {
      return await this.productRepository.getAll();
    } catch (error) {
      throw new Error('Error al obtener los productos: ' + error.message);
    }
  }

  // Crear un producto
  async create(productData) {
    try {
      return await this.productRepository.create(productData);
    } catch (error) {
      throw new Error('Error al crear el producto: ' + error.message);
    }
  }

  // Obtener producto por ID
  async getById(productId) {
    try {
      return await this.productRepository.getById(productId);
    } catch (error) {
      throw new Error('Error al obtener el producto por ID: ' + error.message);
    }
  }

  // Actualizar producto
  async update(productId, productData) {
    try {
      return await this.productRepository.update(productId, productData);
    } catch (error) {
      throw new Error('Error al actualizar el producto: ' + error.message);
    }
  }

  // Eliminar producto
  async delete(productId) {
    try {
      return await this.productRepository.delete(productId);
    } catch (error) {
      throw new Error('Error al eliminar el producto: ' + error.message);
    }
  }
}

export const productService = new ProductService();
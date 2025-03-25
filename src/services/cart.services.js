import Services from "./service.manager.js";
import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import CartModel from "../daos/models/cart.model.js";
import ProductModel from "../daos/models/product.model.js";
const cartDao = new CartDaoMongoDB();

class CartServices extends Services {
  constructor() {
    super(cartDao);
  }
  async getById(cartId) {
    try {
        // Buscar carrito por ID y poblar los productos
        return await CartModel.findById(cartId).populate('products.product');
    } catch (error) {
        throw new Error('Error al obtener el carrito');
    }
}
  createCart = async() =>{
    try {
      return await this.dao.create();
    } catch (error) {
      throw error;
    }
  }

  addProdToCart = async (cartId, prodId) => {
    try {
      return await this.dao.addProdToCart(cartId, prodId);
    } catch (error) {
      throw (error);
    }
  };

  removeProdToCart = async (cartId, prodId) => {
    try {
      return await this.dao.removeProdToCart(cartId, prodId);
    } catch (error) {
      throw (error);
    }
  };

  updateProdQuantityToCart = async (cartId, prodId, quantity) => {
    try {
      return await this.dao.updateProdQuantityToCart(cartId, prodId, quantity);
    } catch (error) {
      throw (error);
    }
  };

  clearCart = async (cartId) => {
    try {
      return await this.dao.clearCart(cartId);
    } catch (error) {
      throw (error);
    }
  };
}

export const cartService = new CartServices();
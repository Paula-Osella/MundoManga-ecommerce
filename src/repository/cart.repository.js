// repositories/cart.repository.js
import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";


export default class CartRepository {
    constructor() {
        this.dao = new CartDaoMongoDB();
    }

    async createCart() {
        return await this.dao.create();
    }

    async getById(cartId) {
        return await this.dao.getById(cartId);
    }

    async getAllCarts() {
        return await this.dao.getAll();
    }

    async addProdToCart(cartId, prodId) {
        return await this.dao.addProdToCart(cartId, prodId);
    }

    async removeProdFromCart(cartId, prodId) {
        return await this.dao.removeProdToCart(cartId, prodId);
    }

    async updateProdQuantityToCart(cartId, prodId, quantity) {
        return await this.dao.updateProdQuantityToCart(cartId, prodId, quantity);
    }

    async clearCart(cartId) {
        return await this.dao.clearCart(cartId);
    }
    async processPurchase(cartId) {
        return await this.dao.processPurchase(cartId);
    }
    
}

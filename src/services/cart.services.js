import Services from "./service.manager.js";
import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";
import CartModel from "../daos/models/cart.model.js";
import ProductModel from "../daos/models/product.model.js";
import CartInputDTO from "../dtos/cart.input.dto.js";
import CartOutputDTO from "../dtos/cart.output.dto.js";
import CartRepository from "../repository/cart.repository.js";
import { ticketService } from "../services/ticket.service.js";
const cartDao = new CartDaoMongoDB();
const cartRepository = new CartRepository();

class CartServices {
    async getById(cartId) {
        return await cartRepository.getById(cartId);
    }

    async getAllCarts() {
        return await cartRepository.getAllCarts();
    }

    async createCart() {
        return await cartRepository.createCart();
    }

    async addProdToCart(cartId, prodId) {
        return await cartRepository.addProdToCart(cartId, prodId);
    }

    async removeProdFromCart(cartId, prodId) {
        return await cartRepository.removeProdFromCart(cartId, prodId);
    }

    async updateProdQuantityToCart(cartId, prodId, quantity) {
        return await cartRepository.updateProdQuantityToCart(cartId, prodId, quantity);
    }



    async clearCart(cartId) {
        return await cartRepository.clearCart(cartId);
    }


    async completePurchase(cartId) {
        try {
            const cart = await cartRepository.getById(cartId);
            const purchaser = cart.userEmail;
            let totalAmount = 0;
            const productsOutOfStock = [];


            for (let item of cart.products) {
                const product = item.product;
                if (product.stock >= item.quantity) {
                    totalAmount += product.price * item.quantity;
                } else {
                    productsOutOfStock.push(item.product.title);
                }
            }


            if (productsOutOfStock.length === 0) {
                const ticket = await ticketService.createTicketFromCart(totalAmount, purchaser);

                await cartRepository.clearCart(cartId);
                return ticket;
            } else {
                return { message: "No se pudo completar la compra, los siguientes productos no tienen suficiente stock", productsOutOfStock };
            }
        } catch (error) {
            throw new Error("Error completing purchase: " + error.message);
        }
    }

}

export const cartService = new CartServices();

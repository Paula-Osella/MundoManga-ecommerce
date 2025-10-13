import Services from "./service.manager.js";

import CartDaoMongoDB from "../daos/mongodb/cart.dao.js";

import CartModel from "../daos/models/cart.model.js";

import ProductModel from "../daos/models/product.model.js";

import CartInputDTO from "../dtos/cart.input.dto.js";

import CartOutputDTO from "../dtos/cart.output.dto.js";

import CartRepository from "../repository/cart.repository.js";

import { ticketService } from "../services/ticket.service.js";

import { sendMailGmail } from "../services/email.services.js";



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



async completePurchase(cartId, userEmail) {
  try {
    const cart = await cartRepository.getById(cartId);
    const purchaser = userEmail || cart.userEmail;
    if (!purchaser) throw new Error('Correo del usuario no disponible');

    let totalAmount = 0;
    const productsOutOfStock = [];
    const updatedProducts = [];
    const purchasedItems = [];

    for (const item of cart.products) {
      const product = await ProductModel.findById(item.product._id);
      if (!product) continue;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();

        const subtotal = product.price * item.quantity;
        totalAmount += subtotal;
        updatedProducts.push(item);

        purchasedItems.push({
          title: product.title,
          price: product.price,
          quantity: item.quantity,
          subtotal
        });
      } else {
        productsOutOfStock.push(product.title);
      }
    }

    // Persisto solo lo comprado (opcional, igual luego limpio)
    cart.products = updatedProducts;
    await cart.save();

    // Creo ticket con ítems
    const ticket = await ticketService.createTicketFromCart(totalAmount, purchaser, purchasedItems);

    // Email NO bloqueante (respuesta más rápida)
(async () => {
  try {
    await sendMailGmail(ticket, purchaser, purchasedItems);
  } catch (e) {
    console.error('Error enviando mail de ticket:', e.message);
  }
})();

    // Limpio carrito
    await cartRepository.clearCart(cartId);

    return { ticket, message: "Compra realizada con éxito.", productsOutOfStock };
  } catch (error) {
    throw new Error("Error completing purchase: " + error.message);
  }
}



}



export const cartService = new CartServices();
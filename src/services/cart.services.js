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


    async completePurchase(cartId, userEmail) {
        try {
            // Recupera el carrito por su ID
            const cart = await cartRepository.getById(cartId);
            
            // Si el carrito no tiene un correo, usa el correo pasado al método
            const purchaser = userEmail || cart.userEmail;
    
            if (!purchaser) {
                throw new Error('Correo del usuario no disponible');
            }
    
            let totalAmount = 0;
            const productsOutOfStock = [];
    
            // Recorremos los productos en el carrito
            for (let item of cart.products) {
                const product = await ProductModel.findById(item.product._id);
    
                // Verificamos si el producto tiene suficiente stock
                if (product.stock >= item.quantity) {
                    // Descontamos el stock
                    product.stock -= item.quantity;
    
                    // Guardamos los cambios en el producto
                    await product.save();
    
                    // Calculamos el total de la compra
                    totalAmount += product.price * item.quantity;
                } else {
                    // Si no hay suficiente stock, lo agregamos a la lista de productos sin stock
                    productsOutOfStock.push(product.title);
                }
            }
    
            // Si todos los productos tienen stock suficiente, creamos el ticket
            if (productsOutOfStock.length === 0) {
                const ticket = await ticketService.createTicketFromCart(totalAmount, purchaser);
    
                // Limpiar el carrito después de la compra
                await cartRepository.clearCart(cartId);
    
                return ticket;
            } else {
                // Si hay productos sin stock, devolvemos el mensaje y los productos no comprados
                return { 
                    message: "No se pudo completar la compra, los siguientes productos no tienen suficiente stock", 
                    productsOutOfStock 
                };
            }
        } catch (error) {
            throw new Error("Error completing purchase: " + error.message);
        }
    }
    
}

export const cartService = new CartServices();

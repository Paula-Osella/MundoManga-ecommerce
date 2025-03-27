import { cartService } from "../services/cart.services.js";
import CartOutputDTO from "../dtos/cart.output.dto.js";


export const cartController = {

    createCart: async (req, res) => {
        try {
            const cart = await cartService.createCart();
            res.status(201).json({ message: "Carrito creado con éxito", cart });
        } catch (error) {
            res.status(500).json({ message: "Error al crear el carrito", error: error.message });
        }
    },

    getCartById: async (req, res) => {
        try {
            const { cartId } = req.params;
            console.log("ID del carrito recibido:", cartId);
            const cart = await cartService.getById(cartId);
            res.status(200).json(cart);
        } catch (error) {
            console.error("Error al obtener el carrito:", error.message);
            res.status(500).json({ message: error.message });
        }
    },

    getAllCarts: async (req, res) => {
        try {
            const carts = await cartService.getAllCarts();
            res.status(200).json(carts);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los carritos", error: error.message });
        }
    },

    addProdToCart: async (req, res) => {
        const { cartId, prodId } = req.params;
        try {
            const updatedCart = await cartService.addProdToCart(cartId, prodId);
            res.status(200).json({ message: "Producto agregado al carrito", updatedCart });
        } catch (error) {
            res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
        }
    },


    removeProdFromCart: async (req, res) => {
        const { cartId, prodId } = req.params;
        try {
            const updatedCart = await cartService.removeProdFromCart(cartId, prodId);

            res.status(200).json({ message: "Producto eliminado del carrito", updatedCart });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
        }
    },


    updateProdQuantityToCart: async (req, res) => {
        const { cartId, prodId } = req.params;
        const { quantity } = req.body;
        try {
            const updatedCart = await cartService.updateProdQuantityToCart(cartId, prodId, quantity);
            res.status(200).json({ message: "Cantidad del producto actualizada", updatedCart });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar la cantidad", error: error.message });
        }
    },


    clearCart: async (req, res) => {
        const { cartId } = req.params;
        try {
            const updatedCart = await cartService.clearCart(cartId);
            res.status(200).json({ message: "Carrito limpio", updatedCart });
        } catch (error) {
            res.status(500).json({ message: "Error al limpiar el carrito", error: error.message });
        }
    },
    async completePurchase(req, res, next) {
        try {
            const { cartId } = req.params;
            const user = req.user;
            const userEmail = user.email;


            const result = await cartService.completePurchase(cartId, userEmail);

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

};

import { cartService } from "../services/cart.services.js";

export const cartController = {

    // Crear un carrito nuevo
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
            const cart = await cartService.getById(cartId);
            res.status(200).json(cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Agregar un producto al carrito
    addProdToCart: async (req, res) => {
        const { cartId, prodId } = req.params;
        try {
            const updatedCart = await cartService.addProdToCart(cartId, prodId);
            res.status(200).json({ message: "Producto agregado al carrito", updatedCart });
        } catch (error) {
            res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
        }
    },

    // Eliminar un producto del carrito
    removeProdFromCart: async (req, res) => {
        const { cartId, prodId } = req.params;
        try {
            const updatedCart = await cartService.removeProdToCart(cartId, prodId);
            res.status(200).json({ message: "Producto eliminado del carrito", updatedCart });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
        }
    },

    // Actualizar la cantidad de un producto en el carrito
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

    // Limpiar el carrito (eliminar todos los productos)
    clearCart: async (req, res) => {
        const { cartId } = req.params;
        try {
            const updatedCart = await cartService.clearCart(cartId);
            res.status(200).json({ message: "Carrito limpio", updatedCart });
        } catch (error) {
            res.status(500).json({ message: "Error al limpiar el carrito", error: error.message });
        }
    },
};

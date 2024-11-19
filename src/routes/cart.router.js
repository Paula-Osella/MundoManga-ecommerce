import { Router } from 'express';
import CartManager from '../services/cartManager.js';

const router = Router();
const cartManager = new CartManager();

// Crear un carrito 
router.post('/', async (req, res) => {
    const { name, phone, dni } = req.body;
    if (!name || !phone || !dni) {
        return res.status(400).json({ message: 'Faltan datos del usuario' });
    }

    try {
        const newCart = await cartManager.createCart({ name, phone, dni });
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
});


// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Cantidad inválida' });
    }

    try {
        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener los productos de un carrito
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = cartManager.carts.find(cart => cart.id === cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json(cart.products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los productos del carrito' });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        if (updatedCart) {
            res.status(200).json(updatedCart);
        } else {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un carrito completo
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const updatedCarts = await cartManager.removeCart(cid);
        if (updatedCarts) {
            res.status(200).json({ message: 'Carrito eliminado correctamente', carts: updatedCarts });
        } else {
            res.status(404).json({ message: 'Carrito no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;


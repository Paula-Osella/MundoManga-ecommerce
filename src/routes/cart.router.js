
import { Router } from 'express';
import CartManager from '../services/CartManager.js';
const router = Router();
const cartManager = new CartManager();

router.use((req, res, next) => {
    console.log(`Petición recibida en /api/carts${req.path}`);
    next();
});

// Crear un carrito x
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart }); // Respondemos con el carrito creado
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ message: 'Error al crear el carrito' }); // Si hay error, respondemos con error
    }
});

// Agregar un producto al carrito x
router.post('/:cid/products/:pid', async (req, res) => {
    let { cid, pid } = req.params;
    const { quantity } = req.body;

    // Limpiar el productId de posibles espacios o saltos de línea
    pid = pid.trim();

    if (!quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Cantidad inválida' });
    }

    try {
        // Pasar el productId limpio al manager
        const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);
        res.status(200).json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: error.message });
    }
});


// Obtener los productos de un carrito x
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ message: 'Productos del carrito obtenidos', products: cart.products });
    } catch (error) {
        console.error('Error al obtener los productos del carrito:', error);
        res.status(500).json({ message: 'Error al obtener los productos del carrito' });
    }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const updatedCart = await cartManager.removeProductFromCart(cid, pid);
        if (updatedCart) {
            res.status(200).json({ message: 'Producto eliminado del carrito', cart: updatedCart });
        } else {
            res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ message: error.message });
    }
});

// Eliminar un carrito completo
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.products = []; // Vaciar el array de productos
        await cart.save();

        res.status(200).json({ message: 'Todos los productos eliminados del carrito', cart });
    } catch (error) {
        console.error('Error al eliminar todos los productos del carrito:', error);
        res.status(500).json({ message: error.message });
    }
});


// Actualizar la cantidad de un producto en el carrito  con un arreglo de productos
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; // Array de productos [{ product: 'id', quantity: 1 }, ...]

    try {
        const cart = await cartManager.getCartById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        cart.products = products.map(({ product, quantity }) => ({ product, quantity }));
        await cart.save();

        res.status(200).json({ message: 'Carrito actualizado', cart });
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
        res.status(500).json({ message: error.message });
    }
});



//Actualizar solo la cantidad de un producto específico
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body; // Nueva cantidad

    try {
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.status(200).json({ message: 'Cantidad de producto actualizada', cart: updatedCart });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto:', error);
        res.status(500).json({ message: error.message });
    }
});




export default router;

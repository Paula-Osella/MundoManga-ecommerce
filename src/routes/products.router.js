import { Router } from "express";
import ProductManager from "../services/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

// Listar productos
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
        const products = await productManager.getAllProducts(limit);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
});

// Obtener producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el producto');
    }
});

// Crear producto
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        // Validar que todos los campos obligatorios estén presentes
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        // Validar tipo de datos
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'El precio debe ser un número positivo' });
        }

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({ error: 'El stock debe ser un número mayor o igual a 0' });
        }

        const newProduct = await productManager.addProduct({ title, description, code, price, stock, category, thumbnails });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

// Actualizar producto por ID
router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;

        // Validar que los campos actualizados sean correctos
        if (updatedFields.price && (typeof updatedFields.price !== 'number' || updatedFields.price <= 0)) {
            return res.status(400).json({ error: 'El precio debe ser un número positivo' });
        }

        if (updatedFields.stock && (typeof updatedFields.stock !== 'number' || updatedFields.stock < 0)) {
            return res.status(400).json({ error: 'El stock debe ser un número mayor o igual a 0' });
        }

        const updatedProduct = await productManager.updateProduct(productId, updatedFields);
        if (updatedProduct) {
            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid; 

        // Validar que el ID del producto sea válido
        if (!productId || typeof productId !== 'string' || productId.trim().length === 0) {
            return res.status(400).json({ error: 'ID de producto inválido' });
        }

        const deletedProduct = await productManager.deleteProduct(productId);
        if (deletedProduct) {
            res.json(deletedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});


export default router;


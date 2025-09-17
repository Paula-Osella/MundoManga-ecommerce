import { productService } from "../services/product.services.js";

export const getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productService.getById(pid);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const productData = req.body; // Aquí tienes los datos de texto (JSON)

        // Si Multer procesó un archivo, su información estará en req.file
        if (req.file) {
            // Construye la URL pública de la imagen
            const imageUrl = `/images/${req.file.filename}`;
            
            // Asigna la URL al campo 'thumbnails'. 
            // Si 'thumbnails' es un array en tu modelo, lo inicializa o le añade la nueva URL.
            productData.thumbnails = productData.thumbnails ? [...productData.thumbnails, imageUrl] : [imageUrl];
        } else {
            // Si no se subió ninguna imagen, asegúrate de que thumbnails sea un array vacío por defecto
            productData.thumbnails = productData.thumbnails || [];
        }

        const newProduct = await productService.create(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const productData = req.body; // Aquí tienes los datos de texto (JSON)

        // Si se sube una nueva imagen durante la actualización
        if (req.file) {
            const imageUrl = `/images/${req.file.filename}`;
            // Puedes decidir si añades esta nueva URL al array existente o si reemplazas las anteriores.
            // Aquí, la añadimos. Si quieres reemplazar, podrías hacer productData.thumbnails = [imageUrl];
            productData.thumbnails = productData.thumbnails ? [...productData.thumbnails, imageUrl] : [imageUrl];
        } else {
             // Si no se subió una nueva imagen, asegúrate de no sobrescribir las thumbnails existentes si no se envió el campo en el body
             // Si el body no incluye thumbnails y no hay req.file, no hacemos nada y Mongoose no lo actualizará a menos que se defina.
             // Si el body *sí* incluye thumbnails pero está vacío, entonces se sobrescribirá.
        }

        const updatedProduct = await productService.update(pid, productData);
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const deletedProduct = await productService.delete(pid);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


import ProductManager from '../manager/ProductManager.js';


export const getAllProducts =async (req,res)=>{
    try {
        console.log('Solicitud recibida en GET /');
        const { limit = 10, page = 1, sort = 'asc', category, status } = req.query;
        console.log('Parámetros de consulta:', { limit, page, sort, category, status });

        let query = {};
        if (category) query.category = category;
        if (status) query.status = status === 'true'; // Convertir a booleano
        console.log('Filtros de búsqueda:', query);

        const result = await ProductManager.getAllProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query
        });
        console.log('Productos obtenidos:', result);

        res.json(result);
    } catch (error) {
        console.error('Error en GET /:', error);
        res.status(500).send('Error al obtener productos');
    }
}

export const getProductById = async (req,res) =>{
    try {
        const productId = req.params.pid;
        console.log('Solicitud recibida en GET /:pid con ID:', productId);

        const product = await ProductManager.getProductById(productId);
        console.log('Producto encontrado:', product);

        res.json(product);
    } catch (error) {
        console.error('Error en GET /:pid:', error);
        res.status(404).json({ error: 'Producto no encontrado' });
    }
}


export const getProductsByCategory = async(req,res)=>{
    try {
        const categoryName = req.params.categoryName;
        console.log('Solicitud recibida para obtener productos de la categoría:', categoryName);

        const productsByCategory = await ProductManager.getProductsByCategory(categoryName);
        if (productsByCategory.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos en esta categoría' });
        }

        res.json(productsByCategory);
    } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

export const addProduct = async (req,res)=>{
    try {
        const { title, description, code, price, stock, category, author, status, thumbnails } = req.body;

        // Validar campos obligatorios
        if (!title || !description || !code || !price || !stock || !category || !author) {
            return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados' });
        }

        // Crear el producto
        const newProduct = await ProductManager.addProduct({ title, description, code, price, stock, category, author, status, thumbnails });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error al crear producto:', error.message);
        res.status(500).json({ error: error.message || 'Ocurrió un error en el servidor' });
    }
}

export const updateProduct = async (req,res) =>{
    try {
        const productId = req.params.pid; // ID recibido de la URL
        const updatedFields = req.body;  // Campos a actualizar

        const updatedProduct = await ProductManager.updateProduct(productId, updatedFields); // Llama al manager

        res.json(updatedProduct); // Envía el producto actualizado como respuesta
    } catch (error) {
        console.error('Error en PUT /:pid:', error.message);
        res.status(400).json({ error: error.message }); // Devuelve el mensaje de error
    }
}

 export const deleteProduct = async (req, res) =>{
    try {
        const productId = req.params.pid;
        console.log('Solicitud recibida en DELETE /:pid con ID:', productId);

        const deletedProduct = await ProductManager.deleteProduct(productId);
        console.log('Producto eliminado:', deletedProduct);

        res.json(deletedProduct);
    } catch (error) {
        console.error('Error en DELETE /:pid:', error);
        res.status(404).json({ error: 'Producto no encontrado' });
    }
 }
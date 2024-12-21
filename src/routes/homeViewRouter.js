import { Router } from "express";
import ProductModel from "../models/product.model.js";
import CartModel from "../models/cart.model.js";
const router = Router();

router.get('/products', async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let category = req.query.category || '';
    let sort = req.query.sort || '';


    let filter = {};

    if (search) {

        filter.title = { $regex: search, $options: 'i' };
    }

    if (category) {

        filter.category = category;
    }

    let sortOption = {};
    if (sort === 'asc') {
        sortOption.price = 1;
    } else if (sort === 'desc') {
        sortOption.price = -1;
    }


    try {

        let result = await ProductModel.paginate(filter, {
            limit,
            page,
            sort: sortOption,
            lean: true,
        });

        if (result.docs.length === 0) {
            return res.render('products', {
                message: `No tenemos productos que coincidan con "${search}"`,
                prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&search=${search}&category=${category}&sort=${sort}` : '',
                nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&search=${search}&category=${category}&sort=${sort}` : '',
                isValid: !(page <= 0 || page > result.totalPages),
            });
        }


        result.prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&search=${search}&category=${category}&sort=${sort}` : '';
        result.nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&search=${search}&category=${category}&sort=${sort}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages);

        res.render('products', result);
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).send('Error al obtener los productos');
    }
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;

    try {

        const cart = await CartModel.findById(cid).populate("products.product").lean();

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }


        cart.products.forEach(item => {
            item.total = item.product.price * item.quantity;
        });

        const cartTotal = cart.products.reduce((total, item) => total + item.total, 0);


        res.render("cart", { cart, cartTotal });
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message);
        res.status(500).send("Error al cargar el carrito");
    }
});


export default router;

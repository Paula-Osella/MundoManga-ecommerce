import { Router } from "express";
import productsRouter from './products.router.js';
import usersRouter from './user.router.js';
import cartRouter from './cart.router.js';
import homeViewRouter from './homeViewRouter.js';

const router = Router(); 


router.get('/MundoManga', (req, res) => {
    res.send('¿Listo para hacer compras?');
});


router.use('/api/products', productsRouter); 
router.use('/api/carts', cartRouter); 
router.use("/users", usersRouter); 
router.use("/", homeViewRouter); 
export default router;

import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js'; 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Routes
app.get('/MundoManga', (req, res) => { 
    res.send('¿Listo para hacer compras?');
});

app.use('/api/products', productsRouter)

app.use('/api/carts', cartRouter);  


// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Ruta 404
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


// Server
const PORT = 8080;
app.listen(PORT, () => {
    console.log('Servidor escuchando en el puerto ' + PORT);
});


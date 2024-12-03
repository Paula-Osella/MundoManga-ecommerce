import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import __dirname from './utils.js';
import homeViewRouter from './routes/homeViewRouter.js';
import { config as configWebsocket } from "./config/websocket.config.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

//configuracion de hbs
app.engine("handlebars", handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'));
// Routes
app.get('/MundoManga', (req, res) => {
    res.send('¿Listo para hacer compras?');
});

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter);
app.use("/", homeViewRouter);


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
const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

//instalacion de Socket io//
configWebsocket(httpServer);


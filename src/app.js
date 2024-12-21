import express from 'express';
import handlebars from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/cart.router.js';
import __dirname from './utils.js';  // Asegúrate de que el archivo 'utils.js' esté bien exportado
import homeViewRouter from './routes/homeViewRouter.js';
import { connectDB } from "./config/mongoose.config.js";


const app = express();
connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); 


app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
import hbs from 'express-handlebars';
app.engine('handlebars', handlebars.engine({
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));


hbs.create({
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
});


app.get('/MundoManga', (req, res) => {
    res.send('¿Listo para hacer compras?');
});


app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use("/", homeViewRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});


app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});


const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

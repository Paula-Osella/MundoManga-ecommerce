import express from 'express';
import handlebars from 'express-handlebars';
import session from 'express-session';
import cookieParser from "cookie-parser";
import productsRouter from './routes/products.router.js';
import usersRouter from './routes/user.router.js'
import cartRouter from './routes/cart.router.js';
import { __dirname } from './utils.js';
import homeViewRouter from './routes/homeViewRouter.js';
import { initMongoDB } from './config/mongoose.config.js';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import './passport/jwt.js';

const app = express();

// Conexión a la base de datos
initMongoDB().then(() => console.log('Base de datos conectada'))
    .catch((error) => console.log(error));

// Configuración de MongoStore
const storeConfig = {
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        crypto: { secret: process.env.SECRET_KEY },
        ttl: 180,
    }),
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 180000 }
};

// Middleware de configuración
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session(storeConfig));

// Inicialización de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine({
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Rutas
app.get('/MundoManga', (req, res) => {
    res.send('¿Listo para hacer compras?');
});
app.use('/api/products', productsRouter);
app.use('/api/carts', cartRouter);
app.use("/users", usersRouter);
app.use("/", homeViewRouter);


// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Servidor
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});

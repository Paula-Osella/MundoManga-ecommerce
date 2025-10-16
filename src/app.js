import express from 'express';
import router from './routes/router.js';
import homeviewRouter from './routes/homeViewRouter.js';
import handlebars from 'express-handlebars';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { __dirname } from './utils.js';
import { initMongoDB } from './config/mongoose.config.js';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import config from './config/config.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import './passport/jwt.js';
import { logger, morganMiddleware } from './config/logger.js';
import { sessionLocals } from './middlewares/sessionLocals.js';

const app = express();

// Parsers y estáticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

// Auth + logs
app.use(authMiddleware);
app.use(morganMiddleware);
app.use(sessionLocals);

// Handlebars
app.engine(
  'handlebars',
  handlebars.engine({
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
    },
  })
);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// Sesiones (MongoStore)
const storeConfig = {
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    crypto: { secret: process.env.SECRET_KEY },
    ttl: 180,
  }),
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 180000 },
};
app.use(session(storeConfig));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Conexión a la base de datos
initMongoDB()
  .then(() => logger.info('Base de datos conectada exitosamente'))
  .catch((error) => logger.error('Error al conectar a la base de datos:', error));

// 👉 Home simple para portfolio (redirige a productos)
app.get('/', (req, res) => res.redirect('/products'));

// Rutas
app.use('/', homeviewRouter); // vistas
app.use('/', router);         // apis + otros

// Manejo de errores
app.use((err, req, res, next) => {
  logger.error(`Error en la aplicación: ${err.message}`, err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// 404
app.use((req, res) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// 🚀 Servidor (Render usa process.env.PORT)
const PORT = process.env.PORT || config.port || 8080;
app.listen(PORT, () => {
  logger.info(`Servidor ejecutándose en http://localhost:${PORT}`);
});

export default app;

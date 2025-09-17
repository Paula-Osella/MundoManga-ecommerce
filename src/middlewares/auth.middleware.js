import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt; // agarramos la cookie 'jwt'

  if (!token) {
    res.locals.user = null; // no hay usuario logueado
    return next();
  }

  try {
    const user = jwt.verify(token, process.env.SECRET_KEY); // verificamos y decodificamos el token
    res.locals.user = user; // info para las vistas (handlebars)
  } catch (error) {
    res.locals.user = null; // token inválido
  }

  next();
};

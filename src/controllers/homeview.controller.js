import ProductModel from "../daos/models/product.model.js";
import CartModel from "../daos/models/cart.model.js";
import { userController } from "../controllers/user.controller.js";
import jwt from 'jsonwebtoken';
import { userService } from "../services/user.services.js";   // ⬅️ para obtener cart del usuario


export const getAllProducts = async (req, res) => {
  try {
    // --- sesión opcional ---
    const token = req.cookies.jwt;
    let username = null;
    let cartId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        username = decoded.email || null;

        // si tenés el cart en el usuario, lo buscamos
        if (username) {
          const user = await userService.getUserByEmail(username);
          if (user && user.cart) cartId = String(user.cart);
        }
      } catch {
        // token inválido: seguimos como anónimo
      }
    }

    // --- filtros / paginación ---
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let search = req.query.search || '';
    let category = req.query.category || '';
    let sort = req.query.sort || '';

    let filter = {};
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    let sortOption = {};
    if (sort === 'asc') sortOption.price = 1;
    else if (sort === 'desc') sortOption.price = -1;

    const result = await ProductModel.paginate(filter, {
      limit,
      page,
      sort: sortOption,
      lean: true,
    });

    const viewData = {
      ...result,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&search=${search}&category=${category}&sort=${sort}` : '',
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&search=${search}&category=${category}&sort=${sort}` : '',
      isValid: !(page <= 0 || page > result.totalPages),
      username,   // ⬅️ para condicionar CTA
      cartId      // ⬅️ para que el front use el carrito
    };

    if (result.docs.length === 0) {
      return res.render('products', {
        ...viewData,
        message: search ? `No tenemos productos que coincidan con "${search}"` : null
      });
    }

    res.render('products', viewData);

  } catch (error) {
    console.error('Error al obtener productos:', error.message);
    res.status(500).send('Error al obtener los productos');
  }
};

// Obtener carrito por ID
export const getCartById = async (req, res) => {
  const { cid } = req.params;
  try {
    // 1) si el middleware puso user, lo usamos
    const username = res.locals.user?.email || null;

    // 2) cartId preferente: el del usuario; sino, el de la URL
    let cartId = null;
    if (username) {
      const user = await userService.getUserByEmail(username);
      cartId = user?.cart ? String(user.cart) : null;
    }
    if (!cartId) cartId = cid;

    // 3) cargar carrito
    const cart = await CartModel.findById(cid).populate("products.product").lean();
    if (!cart) return res.status(404).send("Carrito no encontrado");

    cart.products.forEach(item => item.total = item.product.price * item.quantity);
    const cartTotal = cart.products.reduce((total, item) => total + item.total, 0);

    // 4) render con layout principal y variables para el header
    return res.render('cart', {
      layout: 'main',
      cart,
      cartTotal,
      username,
      cartId
    });
  } catch (error) {
    console.error("Error al obtener el carrito:", error.message);
    res.status(500).send("Error al cargar el carrito");
  }
};

// Mostrar página de registro
export const showRegister = async (req, res) => {
  try {
    res.render("register", { title: "Registro de Usuario" });
  } catch (error) {
    res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
  }
};

// Registrar usuario
export const registerUser = userController.register;

// Mostrar página de login
export const showLogin = async (req, res) => {
  try {
    res.render("login", { title: "Inicio de Sesión" });
  } catch (error) {
    res.status(500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
  }
};

// Página de cambio de contraseña
export const changePasswordPage = (req, res) => {
  const { token } = req.query;
  if (token) res.render('change-password', { token });
  else res.status(400).send('Token inválido');
};

// Login de usuario (limpio y consistente)
export const loginUser = async (req, res, next) => {
  try {
    // userController.login ya espera req, res
    await userController.login(req, res, next);
  } catch (error) {
    // Si algo falla, redirigimos con mensaje de error
    res.redirect('/login?error=' + encodeURIComponent(error.message));
  }
};

export const logoutUser = async (req, res) => {
    try {
        // Limpiamos la cookie JWT
        res.clearCookie('jwt');

        // Redirigimos al login con mensaje de éxito
        res.redirect('/login?message=' + encodeURIComponent('logout_exitoso'));
    } catch (error) {
        console.error('Error en logout:', error.message);
        res.status(500).send('Error al cerrar sesión');
    }
};


export const showResetPassword = async (req, res) => {
  res.render('change-password', { title: "Restablecer Contraseña" });
};

// Vista: pedir email
export const showForgotPassword = (req, res) => {
  res.render('forgot-password'); // tu view
};

// Vista: cambiar clave con token
export const showChangePassword = (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect('/forgot-password?error=' + encodeURIComponent('Token inválido o faltante'));
  res.render('changePassword', { title: "Restablecer Contraseña" }); // ✅ nombre del archivo
};
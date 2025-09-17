// middlewares/roleAuth.js
export const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Usuario no autenticado");
    }

    const userRole = (req.user.role || "").toUpperCase();
    const allowed = allowedRoles.map(r => (r || "").toUpperCase());

    if (!allowed.includes(userRole)) {
      return res.status(403).send("Acceso denegado: rol insuficiente");
    }

    next();
  };
};


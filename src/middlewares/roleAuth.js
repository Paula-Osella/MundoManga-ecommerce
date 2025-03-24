export const roleAuth = (requiredRole) => {  // Ahora acepta un array de roles
    return (req, res, next) => {
        // Verificamos si existe req.user (lo que significa que la autenticación fue exitosa)
        if (!req.user) {
            return res.status(401).send("Usuario no autenticado");
        }

        // Verificamos si el usuario tiene el rol necesario
        const userRole = req.user.role; // Aquí debería ser 'admin' si se trata de un administrador
        if (!userRole) {
            return res.status(403).send("Rol de usuario no encontrado");
        }

        if (userRole.toUpperCase() !== requiredRole.toUpperCase()) {
            return res.status(403).send("Acceso denegado: rol insuficiente");
        }

        next(); // Si todo está bien, seguimos con la creación del producto
    };
};
export const roleAuth = (requiredRole) => {  
    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).send("Usuario no autenticado");
        }


        const userRole = req.user.role; 
        if (!userRole) {
            return res.status(403).send("Rol de usuario no encontrado");
        }

        if (userRole.toUpperCase() !== requiredRole.toUpperCase()) {
            return res.status(403).send("Acceso denegado: rol insuficiente");
        }

        next();
    };
};


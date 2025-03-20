export const roleAuth = (...roles) => {
    return (req, res, next) => {
        // Verifica si el usuario está autenticado
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: No user logged in' }); 
        }

        // Verifica si el usuario tiene un rol permitido
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden: Role ${req.user.role} does not have permission` });
        }

        next(); // Si todo está bien, sigue con la ejecución
    };
};

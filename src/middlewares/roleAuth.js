export const roleAuth = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized: No user logged in' }); 
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: `Forbidden: Role ${req.user.role} does not have permission` });
        }

        next(); 
    };
};

function authorizeRoles(roles) {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            return next();
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    };
}

module.exports = authorizeRoles;


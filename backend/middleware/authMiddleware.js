const checkAdmin = (req, res, next) => {
    const isAdmin = req.headers['is-admin'] === 'true';
    
    if (!isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
};

module.exports = {
    checkAdmin
}; 
const authMiddleware = (req, res, next) => {
    const userId = req.headers['user-id'];
    if (!userId) {
        return res.status(401).json({ message: 'Authentication required' });
    }
    req.userId = userId;
    next();
};

module.exports = authMiddleware; 
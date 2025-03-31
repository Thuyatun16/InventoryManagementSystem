const checkAdmin = (req, res, next) => {
    // const isAdmin = req.headers['is-admin'] === 'true';
    
    // if (!isAdmin) {
    //     return res.status(403).json({ message: 'AAdmin access required' });
    // }
    
    next();
};

module.exports = {
    checkAdmin
}; 
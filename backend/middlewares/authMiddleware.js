const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Extract the token from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user object to the request
        req.user = {
            userId: decoded.userId,
            isAdmin: decoded.isAdmin
        };

        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        // Handle invalid or expired tokens
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
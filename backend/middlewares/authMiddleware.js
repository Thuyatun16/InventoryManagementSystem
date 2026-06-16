const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(500).json({ message: 'JWT secret is not configured' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const userId = decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = {
      userId,
      isAdmin: Boolean(decoded.isAdmin),
      email: decoded.email || null,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;

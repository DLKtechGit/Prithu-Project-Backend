const jwt = require('jsonwebtoken');
require('dotenv').config();


exports.auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode token
    const decoded = jwt.verify(token, 'your_secret_key');

    // Attach role to request object
    req.role = decoded.role;
    req.Id = decoded.userId;

    next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
};

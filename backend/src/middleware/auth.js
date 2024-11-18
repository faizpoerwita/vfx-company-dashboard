const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Auth Middleware - Headers:', JSON.stringify(req.headers, null, 2));

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('Auth Middleware - No Authorization header found');
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: No Authorization header'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Auth Middleware - Invalid Authorization format');
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: Invalid token format'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.log('Auth Middleware - No token found in Authorization header');
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: No token provided'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth Middleware - Token verified successfully:', decoded);
      req.user = decoded;
      next();
    } catch (error) {
      console.log('Auth Middleware - Token verification failed:', error.message);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Authentication failed: Token has expired'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Authentication failed: Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth Middleware - Unexpected error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

module.exports = auth;

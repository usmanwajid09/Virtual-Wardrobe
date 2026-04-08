const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    
    jwt.verify(bearerToken, process.env.JWT_SECRET || 'fallback_secret', (err, authData) => {
      if (err) {
        return res.status(403).json({ error: 'Token expired or invalid', details: err.message });
      }
      req.user = authData;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = verifyToken;

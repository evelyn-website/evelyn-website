const jwt = require('jsonwebtoken');

// Middleware for verifying JWTs
function verifyToken(req, res, next) {
    var token = req.header('Cookie')
    if (!token) {return res.status(401).json({ error: 'Access denied' })}
    token = token.split('=')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.token = decoded.userId;
        next();
    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Invalid token' });
      }   
  }

  function verifyAdmin(req, res, next) {
    var token = req.header('Cookie')
    if (!token) {return res.status(401).json({ error: 'Access denied' })}
    token = token.split('=')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.token = decoded.userId;
        if (decoded.permissions.admin) {
            next()
        } else {
            return res.status(401).json({ error: 'Access denied' })
        }

    } catch (error) {
        console.log(error)
        res.status(401).json({ error: 'Invalid token' });
      }   
  }

  module.exports = {verifyToken, verifyAdmin};

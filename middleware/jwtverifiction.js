const jwt = require('jsonwebtoken');
const secretKey = process.env.JWTSECRET;

// Middleware to protect routes
exports.verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  // Uncomment this if we need AUTH
  // if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {

    // Verify the token
    // Currently hardcoded, because we do not have register and login 
    // So we pretend to have 

    //const verified = jwt.verify(token.split(' ')[1], secretKey);
    req.user = { name: "Ivan", admin: true, uuid: "84ae67f2-323e-41ee-8e46-4d156f1b0e8b" };
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};
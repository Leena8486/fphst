const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Staff = require('../models/Staff');

const protect = async (req, res, next) => {
  let token;

  // ✅ Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // ✅ Fall back to cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user = await User.findById(decoded.id).select('-password');
    if (!user) user = await Staff.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.error('❌ Invalid token:', err.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

const protectAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { protect, protectAdmin };

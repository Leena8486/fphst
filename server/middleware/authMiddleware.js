const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Staff = require('../models/Staff');

// ✅ Only declare once
const protect = async (req, res, next) => {
  const token = req.cookies.token;
  console.log('🔐 Token from cookie:', token); // ✅ Add this

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

// ✅ Export just once
module.exports = { protect, protectAdmin };

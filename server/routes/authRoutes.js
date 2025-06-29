/// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Add this for debug user creation

const { register, login, logout, getUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ✅ Main Auth Routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getUser);

// ✅ Simple Route to Confirm API is Working
router.get('/test', (req, res) => {
  res.send('Login route is reachable');
});

// ✅ TEMP DEBUG ROUTE: Creates a test user you can log in with
router.post('/debug-create-user', async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'debug@test.com' });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash('Test@1234', 10);

    const user = new User({
      name: 'Debug User',
      email: 'debug@test.com',
      phone: '+919999999999',
      role: 'Resident',
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: '✅ Test user created. Use debug@test.com / Test@1234 to log in.',
      user,
    });
  } catch (err) {
    console.error('❌ Error creating test user:', err);
    res.status(500).json({ message: 'Error creating debug user', error: err.message });
  }
});

module.exports = router;

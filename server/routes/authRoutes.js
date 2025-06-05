/// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, logout, getUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');  // destructure here
const authController = require('../controllers/authController');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', logout);
router.get('/me', protect, getUser);  // use protect middleware

router.get('/test', (req, res) => {
  res.send('Login route is reachable');
});

module.exports = router;

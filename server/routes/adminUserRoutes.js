const express = require('express');
const router = express.Router();
const User = require('../models/User');

const {
  assignRoomToUser,
  checkInUser,
  checkOutUser,
  autoAssignRoom,
} = require('../controllers/userController');

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  updateUserRole,
  assignRoom,
  checkIn,
  checkOut,
} = require('../controllers/adminUserController');

const { protect, protectAdmin } = require('../middleware/authMiddleware');
const verifyToken = require('../middleware/verifyToken'); // adjust the path if needed

router.use(protect);

// Admin-only routes
router.get('/', protectAdmin, getAllUsers);
router.post('/', protectAdmin, createUser);
router.put('/:id', protectAdmin, updateUser);
router.delete('/:id', protectAdmin, deleteUser);
router.put('/:id/role', protectAdmin, updateUserRole);
router.put('/:id/assign-room', protectAdmin, assignRoom);
router.put('/:id/check-in', protectAdmin, checkIn);
router.put('/:id/check-out', protectAdmin, checkOut);

// Room assignment and check-in/out (new controller)
router.put('/users/:userId/assign-room', assignRoomToUser);
router.put('/users/:userId/check-in', checkInUser);
router.put('/users/:userId/check-out', checkOutUser);
router.put('/users/:userId/auto-assign', autoAssignRoom);
// backend/routes/admin.js (example)
router.put('/users/:id/check-out', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { checkedIn: false });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Checked out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error checking out' });
  }
});


module.exports = router;

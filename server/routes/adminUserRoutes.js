// routes/adminUserRoutes.js
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

router.use(protect);

// ✅ Admin-only User Management Routes (for /api/admin/users)
router.get('/', protectAdmin, getAllUsers);
router.post('/', protectAdmin, createUser);
router.put('/:id', protectAdmin, updateUser);
router.delete('/:id', protectAdmin, deleteUser);
router.put('/:id/role', protectAdmin, updateUserRole);
router.put('/:id/assign-room', protectAdmin, assignRoom);
router.put('/:id/check-in', protectAdmin, checkIn);
router.put('/:id/check-out', protectAdmin, checkOut);

// ✅ Room assignment and check-in/out (public access — adjust if needed)
router.put('/:userId/assign-room', assignRoomToUser);
router.put('/:userId/check-in', checkInUser);
router.put('/:userId/check-out', checkOutUser);
router.put('/:userId/auto-assign', autoAssignRoom);

console.log('✅ adminUserRoutes loaded');
// ✅ Additional route ONLY for fetching residents (for payment dropdown)
router.get('/residents/list', protectAdmin, async (req, res) => {
  try {
    const residents = await User.find({ role: 'Resident' }).select('_id name email phone');
    res.json(residents);
  } catch (err) {
    console.error('Error fetching residents list:', err);
    res.status(500).json({ message: 'Failed to fetch resident list' });
  }
});


module.exports = router;

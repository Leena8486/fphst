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

// ✅ Middleware to protect all routes
router.use(protect);

// ✅ PLACE STATIC ROUTES BEFORE DYNAMIC ONES

// 🔹 GET: List of residents (used for payments dropdown, etc.)
router.get('/residents/list', protectAdmin, async (req, res) => {
  try {
    const residents = await User.find({ role: 'Resident' }).select('_id name email phone');
    res.json(residents);
  } catch (err) {
    console.error('Error fetching residents list:', err);
    res.status(500).json({ message: 'Failed to fetch resident list' });
  }
});

// 🔹 GET: All users
router.get('/', protectAdmin, getAllUsers);

// 🔹 POST: Create a new user
router.post('/', protectAdmin, createUser);

// 🔹 PUT: Update a user
router.put('/:id', protectAdmin, updateUser);

// 🔹 DELETE: Delete a user
router.delete('/:id', protectAdmin, deleteUser);

// 🔹 PUT: Update user role (Resident ↔ Staff)
router.put('/:id/role', protectAdmin, updateUserRole);

// 🔹 PUT: Assign room manually
router.put('/:id/assign-room', protectAdmin, assignRoom);

// 🔹 PUT: Check-in user manually
router.put('/:id/check-in', protectAdmin, checkIn);

// 🔹 PUT: Check-out user manually
router.put('/:id/check-out', protectAdmin, checkOut);


// ✅ Public/General Room Assignment Endpoints (if needed for internal logic/UI actions)

router.put('/:userId/assign-room', assignRoomToUser);
router.put('/:userId/check-in', checkInUser);
router.put('/:userId/check-out', checkOutUser);
router.put('/:userId/auto-assign', autoAssignRoom);

console.log('✅ adminUserRoutes loaded');

module.exports = router;

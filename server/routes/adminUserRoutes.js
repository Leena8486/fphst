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

// All routes require authentication
router.use(protect);

// ✅ Admin-only routes (will be mounted at /api/admin/users)
router.get('/', protectAdmin, getAllUsers);
router.post('/', protectAdmin, createUser);
router.put('/:id', protectAdmin, updateUser);
router.delete('/:id', protectAdmin, deleteUser);
router.put('/:id/role', protectAdmin, updateUserRole);
router.put('/:id/assign-room', protectAdmin, assignRoom);
router.put('/:id/check-in', protectAdmin, checkIn);
router.put('/:id/check-out', protectAdmin, checkOut);

// ✅ Resident-specific routes (mounted at /api/admin/users/residents)
router.put('/residents/:userId/assign-room', assignRoomToUser);
router.put('/residents/:userId/check-in', checkInUser);
router.put('/residents/:userId/check-out', checkOutUser);
router.put('/residents/:userId/auto-assign', autoAssignRoom);

module.exports = router;

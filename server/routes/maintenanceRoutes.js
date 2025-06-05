const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRequest,
  getRequests,
  assignStaff,
  updateStatus,
  resolveRequest,
  getAllRequestsForResident,
  createMaintenanceRequest,
} = require('../controllers/maintenanceController');


// 🧑‍🔧 Staff/Admin routes
router.get('/', protect, getRequests); // GET all requests (for staff/admin)
router.post('/', protect, createRequest); // POST a new request (admin/staff use)
router.put('/:id/assign', protect, assignStaff);
router.put('/:id/status', protect, updateStatus);
router.put('/:id/resolve', protect, resolveRequest);

// 👤 Resident routes (frontend uses these)
router.post('/resident', protect, createMaintenanceRequest); // resident create
router.get('/resident', protect, getAllRequestsForResident); // resident fetch own


module.exports = router;

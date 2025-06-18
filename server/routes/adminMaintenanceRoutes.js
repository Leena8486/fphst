const express = require('express');
const router = express.Router();
const {
  getMaintenanceByStatus,
  searchResolvedIssues,
  updateMaintenanceStatus,
  deleteMaintenanceRequest, // ✅ Include the delete controller
} = require('../controllers/adminMaintenanceController');

// ✅ Routes
router.get('/maintenance', getMaintenanceByStatus);
router.get('/maintenance/search', searchResolvedIssues);
router.put('/maintenance/:id', updateMaintenanceStatus);
router.delete('/maintenance/:id', deleteMaintenanceRequest); // ✅ Delete route

module.exports = router;

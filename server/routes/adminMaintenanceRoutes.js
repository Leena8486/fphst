const express = require('express');
const router = express.Router();
const {
  getMaintenanceByStatus,
  searchResolvedIssues,
  updateMaintenanceStatus,
} = require('../controllers/adminMaintenanceController');

router.get('/maintenance', getMaintenanceByStatus);
router.get('/maintenance/search', searchResolvedIssues);
router.put('/maintenance/:id', updateMaintenanceStatus);

module.exports = router;

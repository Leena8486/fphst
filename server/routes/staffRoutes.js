const express = require('express');
const router = express.Router();
const {
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
  searchResidentByEmail,
} = require('../controllers/staffController');

// ✅ Only one POST route
router.post('/', createStaff);
router.get('/', getStaff);
router.put('/:id', updateStaff);
router.delete('/:id', deleteStaff);
router.get('/residents/search', searchResidentByEmail);

module.exports = router;

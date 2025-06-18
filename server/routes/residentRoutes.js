const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Payment = require('../models/Payment');

const {
  getResidentProfile,
  updateResidentProfile,
  getResidentMaintenance,
  createMaintenance,
  getResidentPayments,
} = require('../controllers/residentController');

// Protect all routes
router.use(protect);

// ✅ Proper route for GET and PUT /profile
router
  .route('/profile')
  .get(getResidentProfile)
  .put(updateResidentProfile);

router.get('/maintenance', getResidentMaintenance);
router.post('/maintenance', createMaintenance);
router.get('/payments', getResidentPayments);

// ✅ Search route (for admin/staff search functionality)
router.get('/search', async (req, res) => {
  try {
    const query = req.query.query?.trim();
    if (!query) return res.status(400).json({ message: 'Search query required' });

    // Case insensitive regex for name search
    const nameRegex = new RegExp(query, 'i');

    // Search resident by email (exact, lowercase) or name (regex)
    const resident = await User.findOne({
      $or: [
        { email: query.toLowerCase() },
        { name: nameRegex },
      ],
    }).populate('assignedRoom').lean();

    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Fetch payments separately by resident _id
    const payments = await Payment.find({ resident: resident._id });

    // Return combined data
    res.json({
      ...resident,
      payments,
    });
  } catch (error) {
    console.error('[SEARCH ERROR]', error);
    res.status(500).json({ message: 'Error searching resident', error: error.message });
  }
});

module.exports = router;

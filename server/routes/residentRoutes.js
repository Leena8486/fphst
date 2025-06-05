const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Payment = require('../models/Payment');

const {
  getResidentProfile,
  getResidentMaintenance,
  createMaintenance,
  getResidentPayments,
} = require('../controllers/residentController');

router.use(protect); // protect all routes

router.get('/profile', getResidentProfile);
router.get('/maintenance', getResidentMaintenance);
router.post('/maintenance', createMaintenance);
router.get('/payments', getResidentPayments);

// Corrected search route with protect middleware
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

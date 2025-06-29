const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(notifications);
});

router.put('/mark-read/:id', protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});
// ✅ Add at the bottom of notificationRoutes.js
router.post('/test', protect, async (req, res) => {
  try {
    const notification = await Notification.create({
      user: req.user._id,
      message: '✅ This is a test notification!',
      type: 'Other',
    });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;

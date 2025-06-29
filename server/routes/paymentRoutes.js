const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const { protect, protectAdmin } = require("../middleware/authMiddleware");
const {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getMonthlySummary,
  getMyPayments,
} = require("../controllers/paymentController");

// 🔒 Apply authentication middleware to all payment routes
router.use(protect);

// 👤 Resident's own payment history
router.get("/my", getMyPayments);

// 🔧 Admin-only payment CRUD operations
router.get("/summary/monthly", protectAdmin, getMonthlySummary);
router.get("/", protectAdmin, getPayments);
router.post("/", protectAdmin, createPayment);
router.put("/:id", protectAdmin, updatePayment);
router.delete("/:id", protectAdmin, deletePayment);

// 💳 Stripe Checkout Session - Admin only
router.post('/complete-latest', protect, async (req, res) => {
  try {
    const latestPending = await Payment.findOne({
      resident: req.user._id,
      status: 'Pending',
    }).sort({ createdAt: -1 });

    if (!latestPending) {
      return res.status(404).json({ message: 'No pending payment found' });
    }

    latestPending.status = 'Completed';
    await latestPending.save();

    // ✅ Send notification
    await Notification.create({
      user: req.user._id,
      message: `Your payment of ₹${latestPending.amount} for ${latestPending.category} was successful.`,
      type: 'Bill',
    });

    res.json({ message: 'Payment marked as completed' });
  } catch (error) {
    console.error("Mark Complete Error:", error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

module.exports = router;

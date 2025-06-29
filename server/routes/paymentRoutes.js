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
router.post("/create-checkout-session", protectAdmin, async (req, res) => {
  const { amount, description } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: description || 'Hostel Payment',
            },
            unit_amount: amount * 100, // ₹ to paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe Checkout Error:', error.message);
    res.status(500).json({ error: 'Stripe checkout session creation failed' });
  }
});

module.exports = router;

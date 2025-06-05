const express = require("express");
const router = express.Router();

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


module.exports = router;


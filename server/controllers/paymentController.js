const Payment = require('../models/Payment');
const User = require('../models/User');
const sendSMS = require('../utils/sendSms');
const sendEmail = require('../utils/sendEmail');

// Get Payments (with filters, pagination)
const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.resident) filters.resident = req.query.resident;
    if (req.query.date) {
      const date = new Date(req.query.date);
      filters.date = {
        $gte: new Date(date.setHours(0, 0, 0, 0)),
        $lte: new Date(date.setHours(23, 59, 59, 999)),
      };
    }

    const total = await Payment.countDocuments(filters);
    const payments = await Payment.find(filters)
      .populate('resident', 'name email phone')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: payments.map(p => ({
        _id: p._id,
        resident: p.resident?._id,
        residentName: p.resident?.name,
        category: p.category,
        amount: p.amount,
        date: p.date,
        status: p.status,
      })),
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Server error fetching payments' });
  }
};

// Create a new Payment
const createPayment = async (req, res) => {
  try {
    const { resident, category, amount, date, status } = req.body;

    if (!resident || !category || !amount || !date) {
      console.warn('Missing payment fields:', req.body);
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findById(resident);
    if (!user) return res.status(404).json({ message: 'Resident not found' });

    const payment = new Payment({
      resident,
      category,
      amount,
      date,
      status: status || 'Pending',
    });

    await payment.save();

    console.log('✅ Payment saved:', payment);

    // Send SMS
    const phone = user.phone.startsWith('+91') ? user.phone : `+91${user.phone}`;
    try {
      const smsResponse = await sendSMS(phone, amount, category, payment.status);
      if (smsResponse?.Status !== 'Success') {
        console.error('❌ SMS failed:', smsResponse?.Details);
      }
    } catch (smsErr) {
      console.error('❌ SMS error:', smsErr.message);
    }

    // Send Email
    if (user.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Payment Confirmation',
          html: `
            <p>Hello ${user.name},</p>
            <p>Your payment of <strong>₹${amount}</strong> for <strong>${category}</strong> is marked as <strong>${payment.status}</strong>.</p>
          `
        });
      } catch (emailErr) {
        console.error("❌ Email send error:", emailErr.message);
      }
    }

    res.status(201).json({ message: 'Payment saved', payment });

  } catch (err) {
    console.error('❌ Payment creation error:', err.message);
    res.status(500).json({ message: 'Failed to create payment' });
  }
};

// Update Payment
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { resident, category, amount, date, status } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const user = await User.findById(resident);
    if (!user) return res.status(404).json({ message: 'Resident not found' });

    payment.resident = resident;
    payment.category = category;
    payment.amount = amount;
    payment.date = date;
    payment.status = status;

    await payment.save();

    const phone = user.phone.startsWith('+91') ? user.phone : `+91${user.phone}`;
    const smsResponse = await sendSMS(phone, amount, category, payment.status);

    if (!smsResponse || smsResponse.Status !== 'Success') {
      console.error("❌ SMS Send Failed:", smsResponse?.Details || 'Unknown error');
    }

    if (user.email) {
      try {
        await sendEmail({
          to: user.email,
          subject: 'Payment Updated',
          html: `
            <p>Hi ${user.name},</p>
            <p>Your payment has been updated to <strong>₹${amount}</strong> for <strong>${category}</strong>. Status is <strong>${status}</strong>.</p>
          `
        });
      } catch (emailErr) {
        console.error("❌ Email Send Failed:", emailErr.message);
      }
    }

    res.json(payment);
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ message: 'Failed to update payment' });
  }
};

// Delete a payment
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    await payment.deleteOne();
    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ message: 'Failed to delete payment' });
  }
};

// Monthly summary
c

// Get my payments (resident)
const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ resident: req.user.id }).sort({ date: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching my payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getMonthlySummary,
  getMyPayments
};

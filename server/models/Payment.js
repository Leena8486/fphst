const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Assuming residents are users in your system
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Food", "Room Rent", "Previous Balance", "Electricity", "Others"],
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
   status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);

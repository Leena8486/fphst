const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  number: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Single', 'Double', 'Triple', 'Dorm'], default: 'Single' },
  capacity: { type: Number, required: true },
  isOccupied: { type: Boolean, default: false },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  currentOccupancy: { type: Number, default: 0 },

});

module.exports = mongoose.model('Room', roomSchema);

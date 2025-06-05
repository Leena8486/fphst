const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  resident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Assigned', 'CheckedIn', 'CheckedOut'],
    default: 'Assigned'
  },
  assignedAt: { type: Date, default: Date.now },
  checkedInAt: Date,
  checkedOutAt: Date
});

module.exports = mongoose.model('Assignment', assignmentSchema);

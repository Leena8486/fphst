const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  resolutionNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date },
});

// Optional: enable search by title/description if needed in the future
maintenanceSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.models.Maintenance || mongoose.model('Maintenance', maintenanceSchema);

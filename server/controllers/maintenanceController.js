const Maintenance = require('../models/Maintenance');

// Create a new maintenance request
exports.createRequest = async (req, res) => {
  try {
    const request = new Maintenance(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create request', error: err.message });
  }
};

// Get all maintenance requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Maintenance.find()
      .populate('requestedBy', 'name role')
      .populate('assignedTo', 'name role');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch requests', error: err.message });
  }
};
// Assign staff
exports.assignStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { staffId } = req.body;
    const updated = await Maintenance.findByIdAndUpdate(
      id,
      { assignedTo: staffId },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign staff', error: err.message });
  }
};

// Update status
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Maintenance.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
};

// Resolve a request
exports.resolveRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolutionNote } = req.body;
    const updated = await Maintenance.findByIdAndUpdate(
      id,
      {
        status: 'Resolved',
        resolutionNotes: resolutionNote,
        resolvedAt: new Date()
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to resolve request', error: err.message });
  }
};
// Create maintenance request by Resident
exports.createMaintenanceRequest = async (req, res) => {
  try {
    const { title, description } = req.body;

    const newRequest = new Maintenance({
      title,
      description,
      requestedBy: req.user._id, // from protect middleware
    });

    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create maintenance request', error: err.message });
  }
};

// Get all requests for a resident
exports.getAllRequestsForResident = async (req, res) => {
  try {
    const requests = await Maintenance.find({ requestedBy: req.user._id });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch resident requests', error: err.message });
  }
};

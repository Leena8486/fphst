const Maintenance = require('../models/Maintenance');
const User = require('../models/User');

// ✅ GET /api/admin/maintenance?status=Pending
const getMaintenanceByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const requests = await Maintenance.find(filter)
      .populate({
        path: 'requestedBy',
        select: 'name email assignedRoom',
        populate: {
          path: 'assignedRoom',
          select: 'number'
        }
      })
      .populate('room', 'number') // ✅ Room number population
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (err) {
    console.error('[ADMIN FETCH MAINTENANCE ERROR]', err);
    res.status(500).json({ message: 'Failed to fetch maintenance requests' });
  }
};

// ✅ GET /api/admin/maintenance/search?query=leak
const searchResolvedIssues = async (req, res) => {
  const query = req.query.query;
  try {
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const filter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    };

    const results = await Maintenance.find(filter)
      .populate({
        path: 'requestedBy',
        select: 'name email assignedRoom',
        populate: {
          path: 'assignedRoom',
          select: 'number'
        }
      })
      .populate('room', 'number') // ✅ Room number population
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.error('[ADMIN SEARCH ERROR]', err);
    res.status(500).json({ message: 'Search failed' });
  }
};

// ✅ PUT /api/admin/maintenance/:id
const updateMaintenanceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Maintenance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json({ message: 'Status updated', updated });
  } catch (err) {
    console.error('[UPDATE STATUS ERROR]', err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// ✅ DELETE /api/admin/maintenance/:id
const deleteMaintenanceRequest = async (req, res) => {
  try {
    const request = await Maintenance.findByIdAndDelete(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Maintenance request not found' });
    }

    res.json({ message: 'Maintenance request deleted successfully' });
  } catch (err) {
    console.error('[DELETE MAINTENANCE ERROR]', err);
    res.status(500).json({ message: 'Failed to delete maintenance request' });
  }
};

module.exports = {
  getMaintenanceByStatus,
  searchResolvedIssues,
  updateMaintenanceStatus,
  deleteMaintenanceRequest,
};

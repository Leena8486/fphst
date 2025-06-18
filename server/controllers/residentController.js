const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const Payment = require('../models/Payment');
const Room = require('../models/Room');

// ✅ Get resident profile (with room populated)
const getResidentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('assignedRoom'); // Populate full room details

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.set('Cache-Control', 'no-store');
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// ✅ Update resident profile (including room assignment)
const updateResidentProfile = async (req, res) => {
  try {
    const resident = await User.findById(req.user.id);

    if (!resident || resident.role !== 'Resident') {
      return res.status(404).json({ message: 'Resident not found' });
    }

    resident.name = req.body.name || resident.name;
    resident.phone = req.body.phone || resident.phone;
    resident.assignedRoom = req.body.assignedRoom || resident.assignedRoom;

    const updated = await resident.save();

    const populated = await User.findById(updated._id)
      .select('-password')
      .populate('assignedRoom');

    res.json(populated);
  } catch (error) {
    console.error('❌ Error updating resident profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// ✅ Get resident maintenance requests
const getResidentMaintenance = async (req, res) => {
  try {
    const requests = await Maintenance.find({ requestedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('❌ Failed to fetch requests:', error);
    res.status(500).json({ message: 'Failed to fetch requests' });
  }
};

// ✅ Create new maintenance request
const createMaintenance = async (req, res) => {
  try {
    const { title, description } = req.body;

    // ✅ Fetch the logged-in user and their assigned room
    const user = await User.findById(req.user._id);

    if (!user || !user.assignedRoom) {
      return res.status(400).json({ message: 'No room assigned to user' });
    }

    // ✅ Create a new maintenance request with room included
    const newRequest = new Maintenance({
      title,
      description,
      requestedBy: req.user._id,
      room: user.assignedRoom, // ✅ Save the room reference
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error('[CREATE MAINTENANCE ERROR]', err);
    res.status(500).json({ message: 'Failed to create maintenance request' });
  }
};
// ✅ Get resident payments
const getResidentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ resident: req.user.id });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

module.exports = {
  getResidentProfile,
  updateResidentProfile,
  getResidentMaintenance,
  createMaintenance,
  getResidentPayments,
};

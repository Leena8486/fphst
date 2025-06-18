const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const Payment = require('../models/Payment');
const Room = require('../models/Room');

// ✅ Get resident profile
const getResidentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('assignedRoom');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.set('Cache-Control', 'no-store'); // Prevent browser caching
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
    if (!resident) {
      return res.status(404).json({ message: 'Resident not found' });
    }

    // Update fields
    resident.name = req.body.name || resident.name;
    resident.phone = req.body.phone || resident.phone;

    // Room reassignment (if provided)
    if (req.body.room) {
      const room = await Room.findOne({ number: req.body.room });
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      resident.assignedRoom = room._id;
    }

    const updated = await resident.save();

    const populatedResident = await User.findById(updated._id)
      .select('-password')
      .populate('assignedRoom');

    res.json({
      _id: populatedResident._id,
      name: populatedResident.name,
      email: populatedResident.email,
      phone: populatedResident.phone,
      role: populatedResident.role,
      assignedRoom: populatedResident.assignedRoom,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

// ✅ Get resident maintenance requests
const getResidentMaintenance = async (req, res) => {
  try {
    const requests = await Maintenance.find({ requestedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ message: 'Failed to fetch maintenance requests' });
  }
};

// ✅ Create new maintenance request
const createMaintenance = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    const request = new Maintenance({
      requestedBy: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({ message: 'Failed to create request' });
  }
};

// ✅ Get resident payments
const getResidentPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ resident: req.user.id });
    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
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

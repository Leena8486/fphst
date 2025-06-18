const User = require('../models/User');
const Maintenance = require('../models/Maintenance');
const Payment = require('../models/Payment');
const Room = require('../models/Room');

// ✅ Get resident profile
const getResidentProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Disable HTTP caching so client always gets fresh data
    res.set('Cache-Control', 'no-store');

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

// ✅ Get resident maintenance requests
const getResidentMaintenance = async (req, res) => {
  try {
    console.log('✅ Fetching maintenance for:', req.user.id);
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
    if (!req.user || !req.user.id) {
      return res.status(403).json({ message: 'User not authenticated' });
    }

    console.log('🔍 Creating request for user ID:', req.user.id);
    console.log('🔍 Title:', req.body.title);
    console.log('🔍 Description:', req.body.description);

    const request = new Maintenance({
      requestedBy: req.user.id,
      title: req.body.title,
      description: req.body.description,
    });

    await request.save();
    res.status(201).json(request);
  } catch (error) {
    console.error('❌ Error creating maintenance:', error);
    res.status(500).json({ message: 'Failed to create request', error: error.message });
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
const updateResidentProfile = async (req, res) => {
  const resident = await Resident.findById(req.user.id);
  if (!resident) return res.status(404).json({ message: 'Resident not found' });

  resident.name = req.body.name || resident.name;
  resident.phone = req.body.phone || resident.phone;
  resident.roomNumber = req.body.roomNumber || resident.roomNumber;

  const updated = await resident.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    phone: updated.phone,
    roomNumber: updated.roomNumber,
    role: updated.role,
  });
};

module.exports = {
  getResidentProfile,
  getResidentMaintenance,
  createMaintenance,
  getResidentPayments,
  updateResidentProfile,
};

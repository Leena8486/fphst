const Staff = require('../models/Staff');
const User = require('../models/User');

// Create Staff
const createStaff = async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const newStaff = new Staff({ name, email, phone, role, password });
    const saved = await newStaff.save();

    res.status(201).json(saved);
  } catch (err) {
    console.error('Error in createStaff:', err);
    res.status(500).json({ message: 'Server error while creating staff' });
  }
};

// Get all staff
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find();
    res.json(staff);
  } catch (err) {
    console.error('❌ Error fetching staff:', err);
    res.status(500).json({ message: 'Server error while retrieving staff' });
  }
};

// Update Staff
const updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const { name, email, phone, role, password } = req.body;

    staff.name = name || staff.name;
    staff.email = email || staff.email;
    staff.phone = phone || staff.phone;
    staff.role = role || staff.role;

    if (password && password.trim() !== '') {
      staff.password = password;
    }

    const updated = await staff.save();
    res.json(updated);
  } catch (err) {
    console.error('Error in updateStaff:', err);
    res.status(500).json({ message: 'Server error while updating staff' });
  }
};

// Delete Staff
const deleteStaff = async (req, res) => {
  try {
    const deleted = await Staff.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Staff not found' });
    res.json({ message: 'Staff deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting staff:', err);
    res.status(500).json({ message: 'Server error while deleting staff' });
  }
};

// ✅ Search Resident by Email
const searchResidentByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const resident = await User.findOne({ email }).populate('assignedRoom');
    if (!resident || resident.role !== 'Resident') {
      return res.status(404).json({ message: 'Resident not found' });
    }
    res.status(200).json(resident);
  } catch (err) {
    console.error('❌ Error in searchResidentByEmail:', err);
    res.status(500).json({ message: 'Server error while searching resident' });
  }
};

// ✅ Export all functions
module.exports = {
  createStaff,
  getStaff,
  updateStaff,
  deleteStaff,
  searchResidentByEmail,
};

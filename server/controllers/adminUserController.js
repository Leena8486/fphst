const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Room = require('../models/Room');
const sendEmail = require('../utils/sendEmail');
const sendSms = require('../utils/sendSms');

// ✅ Get all users (with optional role filter)
exports.getAllUsers = async (req, res) => {
  try {
    const roleFilter = req.query.role ? { role: req.query.role } : {};
    const users = await User.find(roleFilter)
      .select('_id name email role assignedRoom')
      .populate('assignedRoom', 'number type');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// ✅ Create a new user with default password
exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash('Default1234', 10);
    const user = new User({
      name,
      email: email.toLowerCase(),
      phone,
      role,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'User created with default password: Default1234', user });
  } catch (err) {
    console.error('User creation error:', err);
    res.status(400).json({ message: 'Failed to create user', error: err.message });
  }
};

// ✅ Update user info
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, role },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error('User update error:', err);
    res.status(400).json({ message: 'Failed to update user', error: err.message });
  }
};

// ✅ Update only role
exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role', error: err.message });
  }
};

// ✅ Delete user & update room
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.assignedRoom) {
      const room = await Room.findById(user.assignedRoom);
      if (room) {
        room.assignedTo.pull(user._id);
        room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
        room.isOccupied = room.currentOccupancy >= room.capacity;
        await room.save();
      }
    }

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// ✅ Assign Room with Notification
exports.assignRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    const room = await Room.findById(roomId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (room.currentOccupancy >= room.capacity) {
      return res.status(400).json({ message: 'Room is fully occupied' });
    }

    user.assignedRoom = room._id;
    user.checkedIn = true;
    await user.save();

    if (!room.assignedTo.includes(user._id)) {
      room.assignedTo.push(user._id);
    }

    room.currentOccupancy += 1;
    room.isOccupied = room.currentOccupancy >= room.capacity;
    await room.save();

    // ✅ Email notification
    await sendEmail(
      user.email,
      'Room Assigned Successfully',
      `Hi ${user.name}, you have been assigned Room ${room.number} (${room.type}).`
    );

    // ✅ SMS notification
    if (user.phone && user.phone.length >= 10) {
      await sendSms(
        user.phone,
        `Room ${room.number} assigned. Welcome to the hostel!`
      );
    }

    res.json({ message: 'Room assigned and notifications sent', user });
  } catch (err) {
    console.error('Assign room error:', err);
    res.status(500).json({ message: 'Failed to assign room', error: err.message });
  }
};

// ✅ Auto assign room (if preference logic used)
exports.autoAssignRoom = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'Resident') {
      return res.status(404).json({ message: 'Resident not found' });
    }

    const rooms = await Room.find({ type: user.roomPreference });
    for (const room of rooms) {
      if (room.currentOccupancy < room.capacity) {
        user.assignedRoom = room._id;
        user.checkedIn = true;
        await user.save();

        if (!room.assignedTo.includes(user._id)) {
          room.assignedTo.push(user._id);
        }

        room.currentOccupancy += 1;
        room.isOccupied = room.currentOccupancy >= room.capacity;
        await room.save();

        return res.json({ message: 'Room auto-assigned and checked-in', user });
      }
    }

    res.status(400).json({ message: 'No available rooms for preference' });
  } catch (err) {
    res.status(500).json({ message: 'Auto-assign failed', error: err.message });
  }
};

// ✅ Manual check-in
exports.checkIn = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { checkedIn: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User checked in', user });
  } catch (err) {
    res.status(500).json({ message: 'Check-in failed', error: err.message });
  }
};

// ✅ Manual check-out
exports.checkOut = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const room = await Room.findById(user.assignedRoom);
    user.checkedIn = false;
    user.assignedRoom = null;
    await user.save();

    if (room) {
      room.assignedTo.pull(user._id);
      room.currentOccupancy = Math.max(0, room.currentOccupancy - 1);
      room.isOccupied = room.currentOccupancy >= room.capacity;
      await room.save();
    }

    res.json({ message: 'User checked out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Check-out failed', error: err.message });
  }
};

// ✅ Admin tool to recalculate room occupancy
exports.recalculateRoomOccupancy = async (req, res) => {
  try {
    const rooms = await Room.find();
    for (const room of rooms) {
      const count = await User.countDocuments({ assignedRoom: room._id });
      room.currentOccupancy = count;
      room.isOccupied = count >= room.capacity;
      await room.save();
    }
    res.json({ message: 'Room occupancy recalculated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to recalculate occupancy', error: err.message });
  }
};

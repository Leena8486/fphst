const User = require('../models/User');
const Room = require('../models/Room');

exports.getAllUsers = async (req, res) => {
  try {
    const roleFilter = req.query.role ? { role: req.query.role } : {};

    const users = await User.find(roleFilter)
      .select('_id name email role assignedRoom')
      .populate('assignedRoom', 'number type'); // Populates room object

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to get users' });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const user = new User({
      name,
      email,
      phone,
      role,
      password: 'Default1234',
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error('User creation error:', err);
    res.status(400).json({ message: 'Failed to create user', error: err.message });
  }
};

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

// ✅ Update user role
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

// ✅ Delete user and update room occupancy
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

// ✅ Assign Room with Capacity Check and Auto-Check-In
exports.assignRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const userId = req.params.id;

    console.log("Assigning room:", roomId, "to user:", userId);

    const user = await User.findById(userId);
    const room = await Room.findById(roomId);

    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: 'User not found' });
    }

    if (!room) {
      console.error("Room not found");
      return res.status(404).json({ message: 'Room not found' });
    }

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

    res.json({ message: 'Room assigned successfully', user });
  } catch (err) {
    console.error('Assign room error:', err);
    res.status(500).json({ message: 'Failed to assign room', error: err.message });
  }
};

// ✅ Auto Assign Room Based on Preference
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

// ✅ Manual Check-In
exports.checkIn = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { checkedIn: true }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User checked in', user });
  } catch (err) {
    res.status(500).json({ message: 'Check-in failed', error: err.message });
  }
};

// ✅ Manual Check-Out
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

// ✅ Optional: Recalculate Room Occupancy (admin utility)
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

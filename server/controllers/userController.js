const User = require('../models/User');
const Room = require('../models/Room');

exports.assignRoomToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roomId } = req.body;

    const user = await User.findById(userId);
    const room = await Room.findById(roomId);

    if (!user || !room) {
      return res.status(404).json({ message: 'User or Room not found' });
    }

    // Check room capacity
    if (room.assignedTo.length >= room.capacity) {
      return res.status(400).json({ message: 'Room is already full' });
    }

    // Remove user from old room if any
    if (user.assignedRoom) {
      await Room.findByIdAndUpdate(user.assignedRoom, {
        $pull: { assignedTo: user._id },
        $inc: { currentOccupancy: -1 }
      });
    }

    // Assign new room
    user.assignedRoom = room._id;
    await user.save();

    // Add user to room
    room.assignedTo.push(user._id);
    room.currentOccupancy = room.assignedTo.length;
    await room.save();

    res.status(200).json({ message: 'Room assigned successfully' });
  } catch (error) {
    console.error('Assign room error:', error);
    res.status(500).json({ message: 'Failed to assign room' });
  }
};
// Assign Room to User
exports.assignRoomToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roomId } = req.body;

    const user = await User.findById(userId);
    const room = await Room.findById(roomId);

    if (!user || !room) return res.status(404).json({ message: 'User or Room not found' });

    if (room.assignedTo.length >= room.capacity)
      return res.status(400).json({ message: 'Room is already full' });

    if (user.assignedRoom) {
      await Room.findByIdAndUpdate(user.assignedRoom, {
        $pull: { assignedTo: user._id },
        $inc: { currentOccupancy: -1 }
      });
    }

    user.assignedRoom = room._id;
    await user.save();

    room.assignedTo.push(user._id);
    room.currentOccupancy = room.assignedTo.length;
    await room.save();

    res.status(200).json({ message: 'Room assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Room assignment failed' });
  }
};

// Check-In User
exports.checkInUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user || !user.assignedRoom) return res.status(400).json({ message: 'Room not assigned' });

    user.checkedIn = true;
    await user.save();
    res.status(200).json({ message: 'User checked in' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Check-in failed' });
  }
};

// Check-Out User
exports.checkOutUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user || !user.assignedRoom) return res.status(400).json({ message: 'Room not assigned' });

    const room = await Room.findById(user.assignedRoom);

    user.checkedIn = false;
    user.assignedRoom = null;
    await user.save();

    if (room) {
      room.assignedTo.pull(user._id);
      room.currentOccupancy = room.assignedTo.length;
      await room.save();
    }

    res.status(200).json({ message: 'User checked out' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Check-out failed' });
  }
};

// Auto-Assign Room
exports.autoAssignRoom = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const rooms = await Room.find({
      type: user.roomPreference,
      $expr: { $lt: ['$currentOccupancy', '$capacity'] }
    }).sort({ number: 1 });

    if (rooms.length === 0) return res.status(400).json({ message: 'No rooms available' });

    const room = rooms[0];

    user.assignedRoom = room._id;
    await user.save();

    room.assignedTo.push(user._id);
    room.currentOccupancy = room.assignedTo.length;
    await room.save();

    res.status(200).json({ message: `Auto-assigned to room ${room.number}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Auto-assign failed' });
  }
};

const Room = require('../models/Room');

// ✅ GET all rooms with populated assigned users and live status
exports.getAllRooms = async (req, res) => {
  try {
   const rooms = await Room.find().sort({ number: 1 }).populate('assignedTo');


    const roomsWithStatus = rooms.map(room => ({
      ...room._doc,
      status: room.assignedTo.length >= room.capacity ? 'Fully Occupied' : 'Available',
    }));

    res.json(roomsWithStatus);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get rooms' });
  }
};

// CREATE a new room
exports.createRoom = async (req, res) => {
  const { number, type, capacity } = req.body;
  try {
    const existing = await Room.findOne({ number });
    if (existing) {
      return res.status(400).json({ message: 'Room number already exists' });
    }
    const room = new Room({ number, type, capacity });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create room', error: err.message });
  }
};

// DELETE a room
exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete room' });
  }
};

// UPDATE room
exports.updateRoom = async (req, res) => {
  try {
    const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update room' });
  }
};

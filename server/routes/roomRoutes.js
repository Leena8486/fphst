const express = require('express');
const router = express.Router();
const {
  getAllRooms,
  createRoom,
  deleteRoom,
  updateRoom
} = require('../controllers/roomController');

router.get('/', getAllRooms);
router.post('/', createRoom);
router.delete('/:id', deleteRoom);
router.put('/:id', updateRoom);
console.log('✅ roomRoutes loaded');


module.exports = router;

const express = require('express');
const router = express.Router();
const Room = require('../models/room'); 
const Admin = require('../models/adminStaff'); 

// Book a room
router.post('/bookRoom', async (req, res) => {
    const { room_id, start_time, end_time, purpose, admin_id } = req.body;

    // Validate incoming data
    if (!room_id || !start_time || !end_time || !purpose || !admin_id) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newBooking = await Room.book(room_id, start_time, end_time, purpose, admin_id);
        res.status(201).json({
            success: true,
            message: 'Room booked successfully',
            booking: newBooking[0]
        });
    } catch (error) {
        console.error('Error booking room:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book room',
            error: error.message
        });
    }
});


// Cancel a booking
router.delete('/bookRoom/:booking_id', async (req, res) => {
  try {
      await Room.cancelBooking(req.params.booking_id);
      res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
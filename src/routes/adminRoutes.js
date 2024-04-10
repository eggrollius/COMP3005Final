const express = require('express');
const router = express.Router();
const Member = require('../models/member');  

// Book a room
router.post('/bookRoom', async (req, res) => {
  const { room_id, start_time, end_time, purpose } = req.body;
  if (new Date(start_time) >= new Date(end_time)) {
      return res.status(400).send({ success: false, message: "End time must be after start time." });
  }

  try {
      const { rows } = await pool.query(
          'INSERT INTO room_bookings (room_id, start_time, end_time, purpose) VALUES ($1, $2, $3, $4) RETURNING *',
          [room_id, start_time, end_time, purpose]
      );
      res.json({ success: true, booking: rows[0] });
  } catch (error) {
      console.error('Error booking room:', error);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
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
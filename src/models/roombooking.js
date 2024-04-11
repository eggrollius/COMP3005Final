/**
 * Module for handling database operations for rooms.
 * @module models/Room
 */

const pool = require('../../config/db');
const Admin = require('../models/adminStaff');

/**
 * Class representing a room.
 */
class RoomBooking {
  /**
   * Retrieve all room_bookings from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of room objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM room_bookings');
    return rows;
  }

}

module.exports = RoomBooking;

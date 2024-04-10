/**
 * Module for handling database operations for fitness classes.
 * @module models/FitnessClass
 */

const pool = require('../../config/db');
const Room = require('../models/room');
/**
 * Class representing a fitness class.
 */
class FitnessClass {
  /**
   * Retrieve all fitness classes from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of fitness class objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM fitness_classes');
    return rows;
  }

  /**
   * Find a fitness class by its unique ID.
   * @param {number} id - Unique identifier for the fitness class.
   * @returns {Promise<Object>} A promise that resolves to a fitness class object, or undefined if not found.
   */
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM fitness_classes WHERE class_id = $1', [id]);
    return rows[0];
  }

  /**
   * Create a new fitness class in the database.
   * @param {string} name - Name of the fitness class.
   * @param {number} trainerId - ID of the trainer conducting the class.
   * @param {number} roomId - ID of the room where the class is held.
   * @returns {Promise<Object>} A promise that resolves to the newly created fitness class object.
   */
  static async create(name, room_id, trainer_id, start_time, end_time, capacity, admin_id) {
    // Create a room booking
    const roomBooking = Room.book(room_id, start_time, end_time, name, admin_id);
  
    const { rows } = await pool.query(
      'INSERT INTO fitness_classes (name, trainer_id, room_id, start_time, end_time, capacity, room_booking_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [name, trainer_id, room_id, start_time, end_time, capacity, roomBooking.booking_id]
    );
    return rows[0];
  }

  /**
   * Update details of an existing fitness class in the database.
   * @param {number} id - Unique identifier of the fitness class to update.
   * @param {Object} updates - An object containing updates to the class details.
   * @returns {Promise<Object>} A promise that resolves to the updated fitness class object.
   */
  static async update(id, updates) {
    const existingClass = await this.findById(id);
    const newDetails = { ...existingClass, ...updates };
    const { rows } = await pool.query(
      'UPDATE fitness_classes SET name = $1, trainer_id = $2, room_id = $3, schedule = $4 WHERE class_id = $5 RETURNING *',
      [newDetails.name, newDetails.trainerId, newDetails.roomId, newDetails.schedule, id]
    );
    return rows[0];
  }

  /**
   * Delete a fitness class from the database.
   * @param {number} id - Unique identifier for the fitness class to delete.
   * @returns {Promise<Object>} A promise that resolves to the fitness class object that was deleted.
   */
  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM fitness_classes WHERE class_id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = FitnessClass;

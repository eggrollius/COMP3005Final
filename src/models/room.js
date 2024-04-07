/**
 * Module for handling database operations for rooms.
 * @module models/Room
 */

const pool = require('../../config/db');  // Database connection pool

/**
 * Class representing a room.
 */
class Room {
  /**
   * Retrieve all rooms from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of room objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM rooms');
    return rows;
  }

  /**
   * Find a room by its unique ID.
   * @param {number} id - Unique identifier for the room.
   * @returns {Promise<Object>} A promise that resolves to a room object, or undefined if not found.
   */
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM rooms WHERE room_id = $1', [id]);
    return rows[0];
  }

  /**
   * Create a new room in the database.
   * @param {string} name - Name of the room.
   * @param {number} capacity - Capacity of the room.
   * @returns {Promise<Object>} A promise that resolves to the newly created room object.
   */
  static async create(name, capacity) {
    const { rows } = await pool.query(
      'INSERT INTO rooms (name, capacity) VALUES ($1, $2) RETURNING *',
      [name, capacity]
    );
    return rows[0];
  }

  /**
   * Update details of an existing room in the database.
   * @param {number} id - Unique identifier of the room to update.
   * @param {Object} updates - An object containing updates to the room's details.
   * @returns {Promise<Object>} A promise that resolves to the updated room object.
   */
  static async update(id, updates) {
    const existingRoom = await this.findById(id);
    const newDetails = { ...existingRoom, ...updates };
    const { rows } = await pool.query(
      'UPDATE rooms SET name = $1, capacity = $2 WHERE room_id = $3 RETURNING *',
      [newDetails.name, newDetails.capacity, id]
    );
    return rows[0];
  }

  /**
   * Delete a room from the database.
   * @param {number} id - Unique identifier for the room to delete.
   * @returns {Promise<Object>} A promise that resolves to the room object that was deleted.
   */
  static 

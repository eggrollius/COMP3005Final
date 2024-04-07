/**
 * Module for handling database operations related to trainers.
 * @module models/Trainer
 */

const pool = require('../../config/db');  // Database connection pool

/**
 * Class representing a trainer.
 */
class Trainer {
  /**
   * Retrieve all trainers from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of trainer objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM trainers');
    return rows;
  }

  /**
   * Find a trainer by their unique ID.
   * @param {number} id - Unique identifier for the trainer.
   * @returns {Promise<Object>} A promise that resolves to a trainer object, or undefined if not found.
   */
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM trainers WHERE trainer_id = $1', [id]);
    return rows[0];
  }

  /**
   * Create a new trainer in the database.
   * @param {string} name - Name of the trainer.
   * @param {string} specialization - Trainer's area of specialization.
   * @returns {Promise<Object>} A promise that resolves to the newly created trainer object.
   */
  static async create(name, specialization) {
    const { rows } = await pool.query(
      'INSERT INTO trainers (name, specialization) VALUES ($1, $2) RETURNING *',
      [name, specialization]
    );
    return rows[0];
  }

  /**
   * Update details of an existing trainer in the database.
   * @param {number} id - Unique identifier of the trainer to update.
   * @param {Object} updates - An object containing updates to the trainer's details, such as name and specialization.
   * @returns {Promise<Object>} A promise that resolves to the updated trainer object.
   */
  static async update(id, updates) {
    const existingTrainer = await this.findById(id);
    const newDetails = { ...existingTrainer, ...updates };
    const { rows } = await pool.query(
      'UPDATE trainers SET name = $1, specialization = $2 WHERE trainer_id = $3 RETURNING *',
      [newDetails.name, newDetails.specialization, id]
    );
    return rows[0];
  }

  /**
   * Delete a trainer from the database.
   * @param {number} id - Unique identifier for the trainer to delete.
   * @returns {Promise<Object>} A promise that resolves to the trainer object that was deleted.
   */
  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM trainers WHERE trainer_id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = Trainer;

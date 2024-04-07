/**
 * Module for handling database operations for personal training sessions.
 * @module models/PersonalTrainingSession
 */

const pool = require('../../config/db');

/**
 * Class representing a personal training session.
 */
class PersonalTrainingSession {
  /**
   * Retrieve all personal training sessions from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of personal training session objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM personal_training_sessions');
    return rows;
  }

  /**
   * Find a personal training session by its unique ID.
   * @param {number} id - Unique identifier for the personal training session.
   * @returns {Promise<Object>} A promise that resolves to a personal training session object, or undefined if not found.
   */
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM personal_training_sessions WHERE session_id = $1', [id]);
    return rows[0];
  }

  /**
   * Create a new personal training session in the database.
   * @param {number} memberId - ID of the member attending the session.
   * @param {number} trainerId - ID of the trainer conducting the session.
   * @param {Date} scheduledTime - Scheduled date and time for the session.
   * @returns {Promise<Object>} A promise that resolves to the newly created personal training session object.
   */
  static async create(memberId, trainerId, scheduledTime) {
    const { rows } = await pool.query(
      'INSERT INTO personal_training_sessions (member_id, trainer_id, scheduled_time) VALUES ($1, $2, $3) RETURNING *',
      [memberId, trainerId, scheduledTime]
    );
    return rows[0];
  }

  /**
   * Update details of an existing personal training session in the database.
   * @param {number} id - Unique identifier of the personal training session to update.
   * @param {Object} updates - An object containing updates to the session details.
   * @returns {Promise<Object>} A promise that resolves to the updated personal training session object.
   */
  static async update(id, updates) {
    const existingSession = await this.findById(id);
    const newDetails = { ...existingSession, ...updates };
    const { rows } = await pool.query(
      'UPDATE personal_training_sessions SET member_id = $1, trainer_id = $2, scheduled_time = $3 WHERE session_id = $4 RETURNING *',
      [newDetails.memberId, newDetails.trainerId, newDetails.scheduledTime, id]
    );
    return rows[0];
  }

  /**
   * Delete a personal training session from the database.
   * @param {number} id - Unique identifier for the personal training session to delete.
   * @returns {Promise<Object>} A promise that resolves to the personal training session object that was deleted.
   */
  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM personal_training_sessions WHERE session_id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = PersonalTrainingSession;

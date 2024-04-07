/**
 * Module for handling database operations for equipment.
 * @module models/Equipment
 */

const pool = require('../../config/db');

/**
 * Class representing equipment.
 */
class Equipment {
  /**
   * Retrieve all equipment from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of equipment objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM equipment');
    return rows;
  }

  /**
   * Find equipment by its unique ID.
   * @param {number} id - Unique identifier for the equipment.
   * @returns {Promise<Object>} A promise that resolves to an equipment object, or undefined if not found.
   */
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM equipment WHERE equipment_id = $1', [id]);
    return rows[0];
  }

  /**
   * Create new equipment in the database.
   * @param {string} type - Type of the equipment.
   * @param {string} status - Current status of the equipment (e.g., 'available', 'under maintenance').
   * @returns {Promise<Object>} A promise that resolves to the newly created equipment object.
   */
  static async create(type, status) {
    const { rows } = await pool.query(
      'INSERT INTO equipment (type, status) VALUES ($1, $2) RETURNING *',
      [type, status]
    );
    return rows[0];
  }

  /**
   * Update details of existing equipment in the database.
   * @param {number} id - Unique identifier of the equipment to update.
   * @param {Object} updates - An object containing updates to the equipment's details.
   * @returns {Promise<Object>} A promise that resolves to the updated equipment object.
   */
  static async update(id, updates) {
    const existingEquipment = await this.findById(id);
    const newDetails = { ...existingEquipment, ...updates };
    const { rows } = await pool.query(
      'UPDATE equipment SET type = $1, status = $2 WHERE equipment_id = $3 RETURNING *',
      [newDetails.type, newDetails.status, id]
    );
    return rows[0];
  }

  /**
   * Delete equipment from the database.
   * @param {number} id - Unique identifier for the equipment to delete.
   * @returns {Promise<Object>} A promise that resolves to the equipment object that was deleted.
   */
  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM equipment WHERE equipment_id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = Equipment;

/**
 * Module for handling database operations for administrative staff.
 * @module models/AdminStaff
 */

const pool = require('../../config/db');  // Database connection pool

/**
 * Class representing administrative staff.
 */
class AdminStaff {
  /**
   * Retrieve all administrative staff from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of administrative staff objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM admin_staff');
    return rows;
  }

  /**
   * Find an administrative staff member by their unique ID.
   * @param {number} id - Unique identifier for the administrative staff member.
   * @returns {Promise<Object>} A promise that resolves to an administrative staff object, or undefined if not found.
   */
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM admin_staff WHERE admin_id = $1', [id]);
    return rows[0];
  }

  /**
   * Create a new administrative staff member in the database.
   * @param {string} name - Name of the administrative staff member.
   * @param {string} role - Role of the administrative staff member.
   * @returns {Promise<Object>} A promise that resolves to the newly created administrative staff object.
   */
  static async create(name, role) {
    const { rows } = await pool.query(
      'INSERT INTO admin_staff (name, role) VALUES ($1, $2) RETURNING *',
      [name, role]
    );
    return rows[0];
  }

  /**
   * Update details of an existing administrative staff member in the database.
   * @param {number} id - Unique identifier of the administrative staff member to update.
   * @param {Object} updates - An object containing updates to the staff member's details, such as name and role.
   * @returns {Promise<Object>} A promise that resolves to the updated administrative staff object.
   */
  static async update(id, updates) {
    const existingAdmin = await this.findById(id);
    const newDetails = { ...existingAdmin, ...updates };
    const { rows } = await pool.query(
      'UPDATE admin_staff SET name = $1, role = $2 WHERE admin_id = $3 RETURNING *',
      [newDetails.name, newDetails.role, id]
    );
    return rows[0];
  }

  /**
   * Delete an administrative staff member from the database.
   * @param {number} id - Unique identifier for the administrative staff member to delete.
   * @returns {Promise<Object>} A promise that resolves to the administrative staff object that was deleted.
   */
  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM admin_staff WHERE admin_id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = AdminStaff;

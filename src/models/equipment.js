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
   * Delete a piece of equipment from the database by ID.
   * @param {number} id - The ID of the equipment to delete.
   * @returns {Promise<Object>} A promise that resolves to the deletion result.
   */
  static async deleteById(id) {
    try {
        const { rows } = await pool.query(
            'DELETE FROM equipment WHERE equipment_id = $1 RETURNING *', [id]
        );
        if (rows.length === 0) {
            throw new Error(`No equipment found with ID ${id}`);
        }
        return rows[0]; // Returns the deleted equipment object
    } catch (error) {
        console.error('Error deleting equipment:', error);
        throw error;
    }
  }

    /**
     * Create a new piece of equipment in the database.
     * @param {string} name - The name of the equipment.
     * @param {string} status - The status of the equipment (e.g., "operational", "maintenance").
     * @returns {Promise<Object>} A promise that resolves to the newly created equipment object.
     */
    static async create(name, status) {
      try {
          const { rows } = await pool.query(
              'INSERT INTO equipment (name, status) VALUES ($1, $2) RETURNING *',
              [name, status]
          );
          return rows[0]; // Returns the new equipment object
      } catch (error) {
          console.error('Error creating equipment:', error);
          throw error;
      }
  }

  /**
     * Update details of an existing equipment item in the database.
     * @param {number} id - Unique identifier of the equipment to update.
     * @param {string} name - New name of the equipment.
     * @param {string} status - New status of the equipment.
     * @returns {Promise<Object>} A promise that resolves to the updated equipment object.
     */
  static async update(id, name, status) {
    try {
      const query = `
        UPDATE equipment
        SET name = $1, status = $2
        WHERE equipment_id = $3
        RETURNING *;
      `;
      const { rows } = await pool.query(query, [name, status, id]);
      if (rows.length) {
        return rows[0];  // Return the first row (updated equipment)
      } else {
        throw new Error(`Equipment with ID ${id} not found.`);
      }
    } catch (error) {
      console.error('Error updating equipment:', error);
      throw error;  // Rethrow to handle error outside this function
    }
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

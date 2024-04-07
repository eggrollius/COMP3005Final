/**
 * Module for handling database operations for payments.
 * @module models/Payment
 */

const pool = require('../../config/db');

/**
 * Class representing a payment.
 */
class Payment {
  /**
   * Retrieve all payments from the database.
   * @returns {Promise<Array>} A promise that resolves to an array of payment objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM payments');
    return rows;
  }

  /**
   * Find a payment by its unique ID.
   * @param {number} id - Unique identifier for the payment.
   * @returns {Promise<Object>} A promise that resolves to a payment object, or undefined if not found.
   */
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM payments WHERE payment_id = $1', [id]);
    return rows[0];
  }

  /**
   * Create a new payment in the database.
   * @param {number} memberId - ID of the member making the payment.
   * @param {number} amount - Amount of the payment.
   * @param {Date} paymentDate - Date the payment was made.
   * @param {string} description - Description of what the payment was for.
   * @returns {Promise<Object>} A promise that resolves to the newly created payment object.
   */
  static async create(memberId, amount, paymentDate, description) {
    const { rows } = await pool.query(
      'INSERT INTO payments (member_id, amount, payment_date, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [memberId, amount, paymentDate, description]
    );
    return rows[0];
  }

  /**
   * Update details of an existing payment in the database.
   * @param {number} id - Unique identifier of the payment to update.
   * @param {Object} updates - An object containing updates to the payment's details.
   * @returns {Promise<Object>} A promise that resolves to the updated payment object.
   */
  static async update(id, updates) {
    const existingPayment = await this.findById(id);
    const newDetails = { ...existingPayment, ...updates };
    const { rows } = await pool.query(
      'UPDATE payments SET member_id = $1, amount = $2, payment_date = $3, description = $4 WHERE payment_id = $5 RETURNING *',
      [newDetails.memberId, newDetails.amount, newDetails.paymentDate, newDetails.description, id]
    );
    return rows[0];
  }

  /**
   * Delete a payment from the database.
   * @param {number} id - Unique identifier for the payment to delete.
   * @returns {Promise<Object>} A promise that resolves to the payment object that was deleted.
   */
  static async delete(id) {
    const { rows } = await pool.query('DELETE FROM payments WHERE payment_id = $1 RETURNING *', [id]);
    return rows[0];
  }
}

module.exports = Payment;

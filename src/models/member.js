/**
 * Module to handle database operations related to members.
 * @module models/Member
 */

const pool = require('../../config/db');  // Database connection pool

/**
 * Class representing a member.
 */
class Member {
  /**
   * Find all members in the database.
   * @returns {Promise<Array>} A promise that resolves to an array of member objects.
   */
  static async findAll() {
    const { rows } = await pool.query('SELECT * FROM members');
    return rows;
  }

  /**
   * Find a member by their ID.
   * @param {number} id - Unique identifier for the member.
   * @returns {Promise<Object>} A promise that resolves to a member object or undefined if not found.
   */
  static async findById(id) {
    const { rows } = await pool.query('SELECT * FROM members WHERE member_id = $1', [id]);
    return rows[0];
  }

  /**
   * Create a new member in the database.
   * @param {string} name - Member's name.
   * @param {string} email - Member's email address.
   * @param {string} password - Member's password.
   * @param {Date} dob - Member's date of birth.
   * @param {Object} fitness_goals - Member's fitness goals stored as a JSON object.
   * @param {Object} health_metrics - Member's health metrics stored as a JSON object.
   * @returns {Promise<Object>} A promise that resolves to the newly created member object.
   */
  static async create(name, email, password, dob, fitness_goals, health_metrics) {
    const { rows } = await pool.query(
      'INSERT INTO members (name, email, password, dob, fitness_goals, health_metrics) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, password, dob, JSON.stringify(fitness_goals), JSON.stringify(health_metrics)]
    );
    return rows[0];
  }

  /**
   * Update a member's details in the database, potentially including changing their email, after verifying their current password.
   * @param {string} currentEmail - Current email of the member, used to locate them in the database.
   * @param {string} currentPassword - Current password of the member, for login verification purpose.
   * @param {Object} updates - An object containing the updates to apply to the member. This may include a new email.
   * @param {string} [newEmail] - Optional new email to replace the existing one, if different.
   * @returns {Promise<Object>} A promise that resolves to the updated member object, or null if no updates are made.
   */
  static async updateByEmail(currentEmail, currentPassword, updates, newEmail) {
    // First verify the member's current password
    try {
      const { rows } = await pool.query('SELECT password FROM members WHERE email = $1', [currentEmail]);
      if (rows.length === 0) {
        throw new Error("Member not found.");
      }

      const passwordMatches = rows[0].password == currentPassword;
      if (!passwordMatches) {
        throw new Error("Invalid password.");
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;  // Pass the error up to the route handler to deal with it appropriately
    }

    // Proceed with updates if password is verified
    const setClause = [];
    const values = [];
    let valueCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value && key !== 'email') {
        setClause.push(`${key} = $${valueCount}`);
        values.push(value);
        valueCount++;
      }
    });

    if (newEmail && newEmail !== currentEmail) {
      setClause.push(`email = $${valueCount}`);
      values.push(newEmail);
      valueCount++;
    }

    if (setClause.length === 0) {
      return null;
    }

    const query = `UPDATE members SET ${setClause.join(', ')} WHERE email = $${valueCount} RETURNING *`;
    values.push(currentEmail);

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Failed to update member by email:', error);
      throw error;
    }
  }
}

module.exports = Member;
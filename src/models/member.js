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
   * @param {string} password - Member's hashed password.
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
   * Update a member's details in the database.
   * @param {number} id - Unique identifier for the member.
   * @param {Object} updates - An object containing the updates to apply to the member.
   * @returns {Promise<Object>} A promise that resolves to the updated member object.
   */
  static async update(id, updates) {
    const existingMember = await this.findById(id);
    const newDetails = { ...existingMember, ...updates };
    const { rows } = await pool.query(
      'UPDATE members SET name = $1, email = $2, password = $3, dob = $4, fitness_goals = $5, health_metrics = $6 WHERE member_id = $7 RETURNING *',
      [newDetails.name, newDetails.email, newDetails.password, newDetails.dob, JSON.stringify(newDetails.fitness_goals), JSON

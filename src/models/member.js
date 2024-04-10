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
  
  static async authenticate(email, password) {
    const { rows } = await pool.query('SELECT member_id, password FROM members WHERE email = $1', [email]);
    if (rows.length === 0) {
      throw new Error("Member not found.");
    }
    if(rows[0].password != password) {
      throw new Error("Password does not match");
    }

    return rows[0].member_id;
  }

  /**
   * Retrieves all class enrollments for a given member, including class details.
   * @param {number} memberId - The ID of the member whose enrollments are to be fetched.
   * @returns {Promise<Array>} A promise that resolves to an array of class enrollment details.
   */
  static async getClassEnrollments(memberId) {
    const query = `
        SELECT 
            ce.enrollment_id,
            fc.class_id,
            fc.name AS class_name,
            fc.schedule,
            fc.room_id,
            fc.capacity,
            ce.enrollment_date
        FROM 
            class_enrollments ce
            INNER JOIN fitness_classes fc ON ce.class_id = fc.class_id
        WHERE 
            ce.member_id = $1;
    `;

    try {
        const { rows } = await pool.query(query, [memberId]);
        return rows;
    } catch (error) {
        console.error('Error retrieving class enrollments:', error);
        throw error;
    }
  }


  static async getProfile(memberId) {
    const { rows } = await pool.query(
        'SELECT member_id, name, email, dob, fitness_goals, health_metrics FROM members WHERE member_id = $1',
        [memberId]
    );
    return rows[0];
  }
 
  static async getTrainingSessions(memberId) {
    const query = `
        SELECT pts.session_id, pts.trainer_id, pts.start_time, pts.end_time, t.name as trainer_name
        FROM personal_training_sessions pts
        JOIN trainers t ON pts.trainer_id = t.trainer_id
        WHERE pts.member_id = $1;
    `;

    const { rows } = await pool.query(query, [memberId]);
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

  static async searchMembersByName(name) {
    try {
        const { rows } = await pool.query(
            'SELECT member_id, name, email, dob FROM members WHERE name ILIKE $1 ORDER BY name',
            [`%${name}%`]
        );
        return { success: true, members: rows };
    } catch (error) {
        console.error('Error searching members:', error);
        return { success: false, message: 'Database query failed', error: error.message };
    }
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
  static async updateByEmail(currentEmail, currentPassword, updates) {
    // First verify the member's current password
    try {
      let memberId = this.authenticate(currentEmail, currentPassword);
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;  // Pass the error up to the route handler to deal with it appropriately
    }

    // Proceed with updates if password is verified
    const setClause = [];
    const values = [];
    let valueCount = 1;

    console.log(JSON.stringify(updates));

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && value !== null && (typeof value !== 'string' || value.length > 0)) {
        if (typeof value === 'object' && (key === 'fitness_goals' || key === 'health_metrics')) {
          // Stringify JSON for JSONB columns
          setClause.push(`${key} = $${valueCount}`);
          values.push(JSON.stringify(value));
        } else {
          // Handle other types normally
          setClause.push(`${key} = $${valueCount}`);
          values.push(value);
        }
        valueCount++;
      }
    }

    if (setClause.length === 0) {
      return null;
    }

    const query = `UPDATE members SET ${setClause.join(', ')} WHERE email = $${valueCount} RETURNING *`;
    values.push(currentEmail);

    // Log the query and parameters
    console.log("Executing SQL Query:", query);
    console.log("With Parameters:", values);

    try {
      const { rows } = await pool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error('Failed to update member by email:', error);
      throw error;
    }
  }

  /**
   * Schedules a personal training session for a member, ensuring the session time does not overlap with existing sessions and is within the trainer's available hours.
   * @param {string} email - The email ID of the member scheduling the session.
   * @param {string} password - The password of this member.
   * @param {number} trainerId - The ID of the trainer who will conduct the session.
   * @param {string} startTime - The start timestamp when the session is scheduled to begin.
   * @param {string} endTime - The end timestamp when the session is scheduled to end.
   * @returns {Promise<Object>} A promise that resolves to the newly created training session object.
   */
  static async scheduleTrainingSession(email, password, trainerId, startTime, endTime) {
    
    try {
      const memberId = await this.authenticate(email, password);
      console.log('Scheduling training session with:', {
        memberId,
        email,
        password,
        trainerId,
        startTime,
        endTime
      });
      
      const availabilityQuery = `
          SELECT * FROM trainer_availability
          WHERE trainer_id = $1 AND available_from <= $2 AND available_to >= $3;
      `;
      const overlapQuery = `
          SELECT * FROM personal_training_sessions
          WHERE trainer_id = $1 AND NOT (end_time <= $2 OR start_time >= $3);
      `;

      // Check trainer's availability
      const availabilityResult = await pool.query(availabilityQuery, [trainerId, startTime, endTime]);
      if (availabilityResult.rows.length === 0) {
          throw new Error('Trainer is not available during these times.');
      }

      // Check for overlapping sessions
      const overlapResult = await pool.query(overlapQuery, [trainerId, startTime, endTime]);
      if (overlapResult.rows.length > 0) {
          throw new Error('Trainer has an overlapping booking.');
      }

      // Schedule the session
      const insertQuery = `
          INSERT INTO personal_training_sessions (member_id, trainer_id, start_time, end_time)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
      `;
      const { rows } = await pool.query(insertQuery, [memberId, trainerId, startTime, endTime]);
      return rows[0];

    } catch(error) {
      console.error('Failed to schedule training session:', error);
      throw error;
    }
  }

  static async enrollInClass(memberId, classId) {
    const { rows: existingEnrollments } = await pool.query(
        'SELECT * FROM class_enrollments WHERE member_id = $1 AND class_id = $2',
        [memberId, classId]
    );
    if (existingEnrollments.length > 0) {
        throw new Error('Already enrolled in this class');
    }

    const { rows } = await pool.query(
        'INSERT INTO class_enrollments (member_id, class_id) VALUES ($1, $2) RETURNING *',
        [memberId, classId]
    );
    return rows[0]; 
  }


    /**
     * Remove a class enrollment by enrollment ID.
     * @param {number} enrollmentId - The ID of the class enrollment to remove.
     * @returns {Promise<boolean>} A promise that resolves to a boolean indicating success or failure.
     */
    static async removeFromClass(enrollmentId) {
      try {
          const result = await pool.query(
              'DELETE FROM class_enrollments WHERE enrollment_id = $1 RETURNING *;',
              [enrollmentId]
          );
          return result.rowCount > 0; // Returns true if any rows were deleted, false otherwise
      } catch (error) {
          console.error('Error removing class enrollment:', error);
          throw error; // Rethrow to handle errors at a higher level
      }
  }
}

module.exports = Member;
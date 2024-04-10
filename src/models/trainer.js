const pool = require('../../config/db'); 

class Trainer {
    static async findAll() {
        const { rows } = await pool.query(
            'SELECT * FROM trainers',
             []
        );
        return rows;
    }
    static async authenticate(trainerId, password) {
        const { rows } = await pool.query('SELECT password FROM trainers WHERE trainer_id = $1', [trainerId]);
        if (rows.length === 0 || rows[0].password !== password) {
            return null;  // Authentication failed
        }
        return trainerId;  // Authentication successful
    }

    static async addAvailability(trainerId, availableFrom, availableTo) {
        const { rows } = await pool.query(
            'INSERT INTO trainer_availability (trainer_id, available_from, available_to) VALUES ($1, $2, $3) RETURNING *',
            [trainerId, availableFrom, availableTo]
        );
        return rows[0];
    }

    static async removeAvailability(availabilityId) {
        const { rows } = await pool.query(
            'DELETE FROM trainer_availability WHERE availability_id = $1 RETURNING *',
            [availabilityId]
        );
        return rows[0];
    }

    static async fetchAvailability(trainerId) {
        const { rows } = await pool.query(
            'SELECT * FROM trainer_availability WHERE trainer_id = $1 ORDER BY available_from',
            [trainerId]
        );
        return rows;
    }
}

module.exports = Trainer;

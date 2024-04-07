const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Gym',
  password: '1911peanut',
  port: 5432,
});

module.exports = pool;

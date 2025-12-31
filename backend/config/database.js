const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Create connection pool
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fitsphere',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

// Add SSL for PlanetScale (production)
if (process.env.DB_SSL === 'amazon' || process.env.NODE_ENV === 'production') {
  poolConfig.ssl = 'amazon';
}

const pool = mysql.createPool(poolConfig);

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('MySQL Connected');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
  });

module.exports = pool;


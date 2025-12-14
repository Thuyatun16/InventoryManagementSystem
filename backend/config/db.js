require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Add error handling for connections
db.connect((err) => {
  if (err) {
    console.error('Error connecting to qr_scanner:', err);
    return;
  }
  console.log('Connected to qr_scanner database');
});

module.exports = { db };

require('dotenv').config();

const mysql = require('mysql2');
const fs = require('fs');

const useSSL =
  process.env.DB_SSL === 'true' ||
  (process.env.DB_HOST || '').includes('tidbcloud.com');

let sslConfig;
if (useSSL) {
  sslConfig = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
  };

  if (process.env.DB_SSL_CA_PATH) {
    sslConfig.ca = fs.readFileSync(process.env.DB_SSL_CA_PATH, 'utf8');
  }
}

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslConfig,
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

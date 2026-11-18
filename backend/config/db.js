require('dotenv').config();

const mysql = require('mysql2');
const fs = require('fs');

const dbHost = (process.env.DB_HOST || '').trim();
const localHosts = new Set(['localhost', '127.0.0.1', 'mysql']);
const isLocalHost = localHosts.has(dbHost.toLowerCase());
const useSSL = process.env.DB_SSL
  ? process.env.DB_SSL === 'true'
  : !isLocalHost;

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

const db = mysql.createPool({
  host: dbHost,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: sslConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
});

console.log(
  `[DB] host=${dbHost || 'N/A'} ssl=${useSSL ? 'enabled' : 'disabled'}`
);

db.on('connection', () => {
  console.log('Connected to qr_scanner database');
});

module.exports = { db };

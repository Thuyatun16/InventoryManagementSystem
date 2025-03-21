require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "",
    database: "qr_scanner",
  })

  

// Add error handling for connections
db.connect((err) => {
  if (err) {
    console.error('Error connecting to qr_scanner:', err);
    return;
  }
  console.log('Connected to qr_scanner database');
});

module.exports = { db}; 
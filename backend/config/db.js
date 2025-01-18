require('dotenv').config();

const mysql = require('mysql2');

const db = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "",
    database: "qr_scanner",
  })

  const userDb = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "",
    database: "inventory_db",
  })

// Add error handling for connections
db.connect((err) => {
  if (err) {
    console.error('Error connecting to qr_scanner:', err);
    return;
  }
  console.log('Connected to qr_scanner database');
});

userDb.connect((err) => {
  if (err) {
    console.error('Error connecting to inventory_db:', err);
    return;
  }
  console.log('Connected to inventory_db database');
});

module.exports = { db, userDb }; 
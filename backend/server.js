const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "",
  database: "qr_scanner",
})
db.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected qr_scanner as id ' + db.threadId);
})

const userDb = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "",
  database: "inventory_db",
})
userDb.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected userDb as id ' + userDb.threadId);
})

app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  db.query("SELECT * FROM qr_scanner.user_table WHERE BINARY email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "An error occurred while registering the user." });
    }
    if (result.length > 0) {
      return res.status(409).json({ error: "Email already exists." });
    }
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please fill in all the fields." });
    }

    // Set isAdmin true if email is admin@admin.com
    const isAdmin = email === 'admin@admin.com' ? true : false;

    db.query(
      "INSERT INTO qr_scanner.user_table (username, email, password, isAdmin) VALUES(?,?,?,?)", 
      [username, email, password, isAdmin], 
      (err, result) => {
        if (err) {
          return res.status(500).json({ error: "An error occurred while registering the user." });
        }
        res.status(201).json({ 
          message: "User registered successfully!",
          isAdmin: isAdmin
        });
      }
    );
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT id, email, isAdmin FROM qr_scanner.user_table WHERE email = ? AND password = ?", 
    [email, password], 
    (err, result) => {
      if (err) {
        res.send({ error: "An error occurred while logging in." });
      }
      if (result.length > 0) {
        // Debug logs
        console.log('Raw result:', result[0]);
        console.log('isAdmin value:', result[0].isAdmin);
        console.log('isAdmin type:', typeof result[0].isAdmin);

        const isAdmin = result[0].isAdmin === 1 || result[0].isAdmin === true;
        
        res.status(200).json({ 
          message: "Login successful!",
          userId: result[0].id,
          isAdmin: isAdmin
        });
        
        console.log('Sending response with isAdmin:', isAdmin);
      } else {
        res.send({ message: "Invalid email or password." });
      }
    }
  );
});
//Create a new item
app.post('/create', (req, res) => {
  const { name, quantity, barcode, price, sellPrice } = req.body; // Extract the data from the request body

  if (!name || !quantity || !barcode ) {
    return res.status(400).json({ error: 'Name and quantity are required' });
  }

  const sql = 'INSERT INTO items (name, quantity, barcode, price, sellPrice) VALUES (?, ?, ?, ?, ?)';
 
  userDb.query(sql, [name, quantity,barcode, price, sellPrice], (err, result) => {
    if (err) {
      console.error('Error inserting item:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({ message: 'Item created successfully', itemId: result.insertId });
  });
});
//Read all items

  app.get('/read', (req, res) => {
    userDb.query('SELECT * FROM items', (err, items) => {
      if (err) {
        console.error('Error fetching items:', err.message);
        return res.status(500).json({ message: 'Failed to fetch items', error: err.message });
      }
      res.status(200).json(items);
    });
  });

//update an item

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const { name, quantity, price, sellPrice} = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ error: 'Name and quantity are required' });
  }
  const qurey = 'UPDATE items SET name =?, quantity = ?, price = ?, sellPrice = ? WHERE id = ?';
  userDb.query(qurey, [name, quantity, price, sellPrice, id], (err, result) => {
    if (err) {
      console.error("Error Updating item:", err)
      return res.status(500).send('Server Error');
    }
    if (result.affectedRows === 0) {
      return res.status(404).send("Item not found");
    }
    res.status(200).send("Item updated successfully");
  });
});
//delete an item
app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE from items WHERE id = ?';
  userDb.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleteing item :', err);
      return res.status(500).send('Server error');
    }
    if (result.affectedRow === 0) {
      return res.status(404).send('Item not found');
    }
    res.status(200).send('Item deleted successfully');
  });
});
//sell an item


app.get('/sell/:barcode', (req, res) => {
    const barcode = req.params.barcode;
    const query = 'SELECT * FROM items WHERE barcode = ?';
    
    userDb.query(query, [barcode], (err, results) => {
        if (err) {
            console.error('Error fetching item:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        res.json(results[0]); // Send the first matching item
    });
});

// Add this new endpoint for processing sales
app.post('/sell', async (req, res) => {
    const { id, soldQuantity } = req.body;
    
    // First get current quantity
    const getQuery = 'SELECT quantity FROM items WHERE id = ?';
    
    userDb.query(getQuery, [id], (err, results) => {
        if (err) {
            console.error('Error fetching item:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        const currentQuantity = results[0].quantity;
        const newQuantity = currentQuantity - soldQuantity;
        
        if (newQuantity < 0) {
            return res.status(400).json({ message: 'Not enough stock' });
        }
        
        // Update the quantity
        const updateQuery = 'UPDATE items SET quantity = ? WHERE id = ?';
        userDb.query(updateQuery, [newQuantity, id], (updateErr, updateResult) => {
            if (updateErr) {
                console.error('Error updating quantity:', updateErr);
                return res.status(500).json({ message: 'Error updating quantity' });
            }
            
            res.json({ message: 'Sale processed successfully' });
        });
    });
});

// Add this new endpoint for saving orders
app.post('/checkout', async (req, res) => {
    const { userId, items, totalAmount } = req.body;
    
    // Start transaction
    db.beginTransaction((err) => {
        if (err) { throw err; }

        // Create order history record in qr_scanner database
        db.query(
            'INSERT INTO qr_scanner.order_history (user_id, total_amount) VALUES (?, ?)',
            [userId, totalAmount],
            (err, result) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ message: 'Error creating order' });
                    });
                }

                const orderId = result.insertId;

                // Insert order items
                const orderItems = items.map(item => [
                    orderId,
                    item.id,
                    item.sellQuantity,
                    item.sellPrice,
                    item.subtotal
                ]);

                db.query(
                    'INSERT INTO qr_scanner.order_items (order_id, item_id, quantity, price_at_time, subtotal) VALUES ?',
                    [orderItems],
                    (err) => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({ message: 'Error creating order items' });
                            });
                        }

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({ message: 'Error committing transaction' });
                                });
                            }
                            res.json({ message: 'Order created successfully', orderId });
                        });
                    }
                );
            }
        );
    });
});

// Add new endpoint for all orders (admin only)
app.get('/orders/all', (req, res) => {
    console.log('Fetching all orders');//debug
    const query = `
        SELECT 
            oh.*,
            oi.item_id,
            oi.quantity,
            oi.price_at_time,
            oi.subtotal,
            i.name,
            u.username as customer_name
        FROM qr_scanner.order_history oh
        LEFT JOIN qr_scanner.order_items oi ON oh.order_id = oi.order_id
        LEFT JOIN inventory_db.items i ON oi.item_id = i.id
        LEFT JOIN qr_scanner.user_table u ON oh.user_id = u.id
        ORDER BY oh.order_date DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ message: 'Error fetching orders' });
        }
        console.log('All orders results:', results); // Debug log

        const groupedOrders = results.reduce((acc, row) => {
            if (!acc[row.order_id]) {
                acc[row.order_id] = {
                    order_id: row.order_id,
                    order_date: row.order_date,
                    total_amount: row.total_amount,
                    customer_name: row.customer_name,
                    user_id: row.user_id,
                    items: []
                };
            }
            
            if (row.item_id) {
                acc[row.order_id].items.push({
                    name: row.name,
                    quantity: row.quantity,
                    price: row.price_at_time,
                    subtotal: row.subtotal
                });
            }
            
            return acc;
        }, {});

        const formattedResults = Object.values(groupedOrders);
        console.log('Formatted all orders:', formattedResults); // Debug log
        res.json(formattedResults);
    });
});

// Then the user-specific orders route
app.get('/orders/:userId', (req, res) => {
    const userId = req.params.userId;
    console.log('Fetching orders for user:', userId);
    
    const query = `
        SELECT 
            oh.*,
            oi.item_id,
            oi.quantity,
            oi.price_at_time,
            oi.subtotal,
            i.name,
            u.username as customer_name
        FROM qr_scanner.order_history oh
        LEFT JOIN qr_scanner.order_items oi ON oh.order_id = oi.order_id
        LEFT JOIN inventory_db.items i ON oi.item_id = i.id
        LEFT JOIN qr_scanner.user_table u ON oh.user_id = u.id
        WHERE oh.user_id = ?
        ORDER BY oh.order_date DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ message: 'Error fetching orders' });
        }
        console.log('User orders results:', results);

        const groupedOrders = results.reduce((acc, row) => {
            if (!acc[row.order_id]) {
                acc[row.order_id] = {
                    order_id: row.order_id,
                    order_date: row.order_date,
                    total_amount: row.total_amount,
                    customer_name: row.customer_name,
                    items: []
                };
            }
            
            if (row.item_id) {
                acc[row.order_id].items.push({
                    name: row.name,
                    quantity: row.quantity,
                    price: row.price_at_time,
                    subtotal: row.subtotal
                });
            }
            
            return acc;
        }, {});

        const formattedResults = Object.values(groupedOrders);
        console.log('Formatted user orders:', formattedResults);
        res.json(formattedResults);
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


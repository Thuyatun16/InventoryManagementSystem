const { userDb, db } = require('../config/db');

// Create Product
const createProduct = async (req, res) => {
    const { name, quantity, barcode, price, sellPrice } = req.body;

    if (!name || !quantity || !barcode) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    try {
        const sql = 'INSERT INTO items (name, quantity, barcode, price, sellPrice) VALUES (?, ?, ?, ?, ?)';
        userDb.query(sql, [name, quantity, barcode, price, sellPrice], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'Item created successfully', itemId: result.insertId });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get All Products
const getAllProducts = async (req, res) => {
    try {
        userDb.query('SELECT * FROM items', (err, items) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch items', error: err.message });
            }
            res.status(200).json(items);
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, quantity, price, sellPrice } = req.body;

    if (!name || !quantity) {
        return res.status(400).json({ error: 'Name and quantity are required' });
    }

    try {
        const query = 'UPDATE items SET name =?, quantity = ?, price = ?, sellPrice = ? WHERE id = ?';
        userDb.query(query, [name, quantity, price, sellPrice, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Server Error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Item not found" });
            }
            res.status(200).json({ message: "Item updated successfully" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE from items WHERE id = ?';
        userDb.query(query, [id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Server error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.status(200).json({ message: 'Item deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get Product by Barcode
const getProductByBarcode = async (req, res) => {
    const barcode = req.params.barcode;
    try {
        const query = 'SELECT * FROM items WHERE barcode = ?';
        userDb.query(query, [barcode], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.json(results[0]);
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Process Sale
const processSale = async (req, res) => {
    const { id, soldQuantity } = req.body;
    
    try {
        const getQuery = 'SELECT quantity FROM items WHERE id = ?';
        userDb.query(getQuery, [id], (err, results) => {
            if (err) {
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
            
            const updateQuery = 'UPDATE items SET quantity = ? WHERE id = ?';
            userDb.query(updateQuery, [newQuantity, id], (updateErr) => {
                if (updateErr) {
                    return res.status(500).json({ message: 'Error updating quantity' });
                }
                res.json({ message: 'Sale processed successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Process Checkout
const processCheckout = async (req, res) => {
    const { userId, items, totalAmount } = req.body;
    
    try {
        db.beginTransaction(async (err) => {
            if (err) throw err;

            try {
                // Create order history record
                const [orderResult] = await db.promise().query(
                    'INSERT INTO order_history (user_id, total_amount) VALUES (?, ?)',
                    [userId, totalAmount]
                );

                const orderId = orderResult.insertId;

                // Insert order items
                const orderItems = items.map(item => [
                    orderId,
                    item.id,
                    item.sellQuantity,
                    item.sellPrice,
                    item.subtotal
                ]);

                await db.promise().query(
                    'INSERT INTO order_items (order_id, item_id, quantity, price_at_time, subtotal) VALUES ?',
                    [orderItems]
                );

                await db.promise().commit();
                res.json({ message: 'Order created successfully', orderId });
            } catch (error) {
                await db.promise().rollback();
                throw error;
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

// Get Orders
const getOrders = async (req, res) => {
    const userId = req.params.userId;
    const isAdmin = req.query.isAdmin === 'true';
    const userFilter = req.query.userFilter || '';
    
    console.log("checking isAdmin", isAdmin);
    console.log("checking userId", userId);
    console.log("checking userFilter", userFilter);
    
    try {
        const query = isAdmin ? 
            `SELECT 
                oh.*,
                oi.item_id,
                oi.quantity,
                oi.price_at_time,
                oi.subtotal,
                i.name,
                u.username as customer_name
            FROM order_history oh
            LEFT JOIN order_items oi ON oh.order_id = oi.order_id
            LEFT JOIN inventory_db.items i ON oi.item_id = i.id
            LEFT JOIN user_table u ON oh.user_id = u.id
            ${userFilter ? 'WHERE u.username LIKE ?' : ''}
            ORDER BY oh.order_date DESC` :
            `SELECT 
                oh.*,
                oi.item_id,
                oi.quantity,
                oi.price_at_time,
                oi.subtotal,
                i.name,
                u.username as customer_name
            FROM order_history oh
            LEFT JOIN order_items oi ON oh.order_id = oi.order_id
            LEFT JOIN inventory_db.items i ON oi.item_id = i.id
            LEFT JOIN user_table u ON oh.user_id = u.id
            WHERE oh.user_id = ?
            ORDER BY oh.order_date DESC`;

        const params = isAdmin ? 
            (userFilter ? [`%${userFilter}%`] : []) : 
            [userId];
        
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Error fetching orders' });
            }

            

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
            console.log('Formatted results:', formattedResults);
            res.json(formattedResults);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    getProductByBarcode,
    processSale,
    processCheckout,
    getOrders
}; 
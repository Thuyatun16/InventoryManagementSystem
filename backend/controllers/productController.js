const {  db } = require('../config/db');

// Create Product
const createProduct = async (req, res) => {
    const { name, quantity, barcode, price, sellPrice } = req.body;

    if (!name || !quantity || !barcode) {
        return res.status(400).json({ error: 'Required fields missing' });
    }

    try {
        const sql = 'INSERT INTO items (name, quantity, barcode, price, sellPrice) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [name, quantity, barcode, price, sellPrice], (err, result) => {
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
        db.query('SELECT * FROM items', (err, items) => {
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
        db.query(query, [name, quantity, price, sellPrice, id], (err, result) => {
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
        db.query(query, [id], (err, result) => {
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
        db.query(query, [barcode], (err, results) => {
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
        console.log(id, soldQuantity);
        const getQuery = 'SELECT quantity FROM items WHERE id = ?';
        db.query(getQuery, [id], (err, results) => {
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
            db.query(updateQuery, [newQuantity, id], (updateErr) => {
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
    const { items, total_amount, customer_id, use_points, userId } = req.body;

    try {
        // Start transaction
        await db.promise().beginTransaction();

        try {
            // Fetch point settings
            const [pointSettings] = await db.promise().query('SELECT * FROM point_settings ORDER BY id DESC LIMIT 1');
            const { points_per_amount, discount_per_point, minimum_points_for_discount } = pointSettings[0];

            // Create order history record
           
            // Calculate points earned
            const pointsEarned = Math.floor(total_amount * points_per_amount);

            // Redeem points if applicable
            let pointsRedeemed = 0;
            let discount = 0;
            let final_amount = 0;
            if (use_points) {
                const [customerResults] = await db.promise().query(
                    'SELECT points FROM customers WHERE id = ?',
                    [customer_id]
                );
                const customer = customerResults[0];

                if (customer.points >= minimum_points_for_discount) {
                    const maxDiscount = Math.floor(customer.points/minimum_points_for_discount)* discount_per_point;
                     discount = Math.min(maxDiscount,total_amount);
                    pointsRedeemed = Math.floor(discount / discount_per_point)*minimum_points_for_discount;
                    const total_spent = total_amount - discount;
                    // Update customer points
                    await db.promise().query(
                        'UPDATE customers SET points = points - ? WHERE id = ?',
                        [pointsRedeemed, customer_id]
                    );
                }
            }
            
            final_amount = total_amount - discount;
            console.log(final_amount,'this is final amount');
            // Update customer points with earned points
            await db.promise().query(
                'UPDATE customers SET points = points + ?, total_spent = total_spent + ? WHERE id = ?',
                [pointsEarned,final_amount, customer_id]
            );
            const [orderResult] = await db.promise().query(
                'INSERT INTO order_history (user_id, total_amount,discount,final_amount) VALUES (?, ?,?,?)',
                [userId, total_amount,discount,final_amount]
            );
          
            const orderId = orderResult.insertId; // Get the orderId immediately after creating the order

            // Insert order items
            const orderItems = items.map(item => [
                orderId,
                item.id,
                item.quantity,
                item.price,
                item.subtotal
            ]);
            await db.promise().query(
                'INSERT INTO order_items (order_id, item_id, quantity, price_at_time, subtotal) VALUES ?',
                [orderItems]
            );
            // Insert into point_transactions
            await db.promise().query(
                'INSERT INTO point_transactions (customer_id, order_id, points_earned, points_redeemed) VALUES (?, ?, ?, ?)',
                [customer_id, orderId, pointsEarned, pointsRedeemed]
            );

            await db.promise().commit();
            res.json({ message: 'Order created successfully', orderId, points_earned: pointsEarned, pointsRedeemed: pointsRedeemed, discount: discount});
        } catch (error) {
            await db.promise().rollback();
            throw error;
        }
    } catch (error) {
        console.error('Checkout error:', error);
        res.status(500).json({ error: "Server error", details: error.message });
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
            LEFT JOIN qr_scanner.items i ON oi.item_id = i.id
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
            LEFT JOIN qr_scanner.items i ON oi.item_id = i.id
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
                        discount : row.discount,
                        final_amount : row.final_amount,
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
           // console.log('Formatted results:', formattedResults);
            res.json(formattedResults);
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: "Server error" });
    }
};

const redeemPoints = async (req, res) => {
    const { id } = req.params;
    const { points_to_redeem } = req.body;
    console.log(id, points_to_redeem," this is point and Id to redeem");
    try {
        db.beginTransaction(async (err) => {
            if (err) throw err;

            try {
                // Get current points and settings
                const getPointsQuery = `
                    SELECT c.*, ps.discount_per_point, ps.minimum_points_for_discount 
                    FROM customers c 
                    CROSS JOIN point_settings ps 
                    WHERE c.id = ?
                `;

                db.query(getPointsQuery, [id], async (err, results) => {
                    if (err) throw err;

                    if (results.length === 0) {
                        return res.status(404).json({ message: "Customer not found" });
                    }

                    const customer = results[0];

                    if (customer.points < points_to_redeem) {
                        return res.status(400).json({ message: "Insufficient points" });
                    }

                    if (points_to_redeem < customer.minimum_points_for_discount) {
                        return res.status(400).json({ message: "Minimum points requirement not met" });
                    }

                    const discount_amount = points_to_redeem * customer.discount_per_point;

                    // Update customer points
                    const updatePointsQuery = `
                        UPDATE customers 
                        SET points = points - ? 
                        WHERE id = ?
                    `;

                    db.query(updatePointsQuery, [points_to_redeem, id], (err) => {
                        if (err) throw err;

                        db.commit((err) => {
                            if (err) {
                                return db.rollback(() => {
                                    throw err;
                                });
                            }
                            res.json({
                                message: "Points redeemed successfully",
                                discount_amount,
                                remaining_points: customer.points - points_to_redeem
                            });
                        });
                    });
                });
            } catch (error) {
                return db.rollback(() => {
                    throw error;
                });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
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
    getOrders,
    redeemPoints
}; 
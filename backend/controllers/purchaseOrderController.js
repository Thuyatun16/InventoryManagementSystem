const { db } = require('../config/db');

const getAllOrders = async (req, res) => {
    try {
        const query = `
            SELECT 
                po.*,
                i.name as item_name,
                i.quantity as current_stock,
                s.name as supplier_name,
                u.username as created_by_user
            FROM purchase_orders po
            JOIN items i ON po.item_id = i.id
            JOIN suppliers s ON po.supplier_id = s.id
            LEFT JOIN user_table u ON po.created_by = u.id
            ORDER BY po.order_date DESC
        `;
        
        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching purchase orders:', err);
                return res.status(500).json({ message: "Error fetching purchase orders" });
            }
            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const createOrder = async (req, res) => {
    try {
        const { item_id, quantity, supplier_id, expected_date } = req.body;
        const userId = req.headers['user-id'];

        const query = `
            INSERT INTO purchase_orders 
            (item_id, quantity, supplier_id, expected_date, created_by)
            VALUES (?, ?, ?, ?, ?)
        `;
        
        db.query(
            query,
            [item_id, quantity, supplier_id, expected_date, userId],
            (err, result) => {
                if (err) {
                    console.error('Error creating purchase order:', err);
                    return res.status(500).json({ message: "Error creating purchase order" });
                }
                res.status(201).json({
                    message: "Purchase order created successfully",
                    orderId: result.insertId
                });
            }
        );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const receiveOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        // Start transaction
        db.beginTransaction(async (err) => {
            if (err) throw err;

            try {
                // 1. Get order details
                const getOrderQuery = `
                    SELECT po.*, i.name as item_name 
                    FROM purchase_orders po
                    JOIN items i ON po.item_id = i.id
                    WHERE po.id = ? AND po.status = "PENDING"
                `;
                
                db.query(getOrderQuery, [orderId], async (err, orders) => {
                    if (err) throw err;
                    
                    if (orders.length === 0) {
                        return res.status(404).json({ message: "Order not found or already received" });
                    }

                    const order = orders[0];

                    // 2. Update inventory
                    const updateInventoryQuery = `
                        UPDATE items 
                        SET quantity = quantity + ?
                        WHERE id = ?
                    `;
                    
                    db.query(updateInventoryQuery, [order.quantity, order.item_id], (err) => {
                        if (err) throw err;

                        // 3. Update order status
                        const updateOrderQuery = `
                            UPDATE purchase_orders 
                            SET status = 'RECEIVED'
                            WHERE id = ?
                        `;
                        
                        db.query(updateOrderQuery, [orderId], (err) => {
                            if (err) throw err;

                            // Commit transaction
                            db.commit((err) => {
                                if (err) {
                                    return db.rollback(() => {
                                        throw err;
                                    });
                                }
                                res.json({ message: "Order received and inventory updated" });
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

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        
        const query = 'DELETE FROM purchase_orders WHERE id = ? AND status = "PENDING"';
        
        db.query(query, [orderId], (err, result) => {
            if (err) {
                console.error('Error deleting purchase order:', err);
                return res.status(500).json({ message: "Error deleting purchase order" });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Order not found or already received" });
            }
            
            res.json({ message: "Purchase order deleted successfully" });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllOrders,
    createOrder,
    receiveOrder,
    deleteOrder
}; 
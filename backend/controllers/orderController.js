const { db } = require('../config/db');
const { addPointsForOrder } = require('./pointsController');

const createOrder = async (req, res) => {
    const { items, total_amount, customer_id, use_points } = req.body;

    // Input validation
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid order items' });
    }
    if (total_amount <= 0) {
        return res.status(400).json({ message: 'Invalid total amount' });
    }

    const connection = await db.promise().getConnection();

    try {
        await connection.beginTransaction();

        let finalAmount = total_amount;
        let pointsUsed = 0;
        let pointsEarned = 0;

        // Validate customer and points if applicable
        if (customer_id && use_points) {
            const [customerResults] = await connection.query(
                'SELECT * FROM customers WHERE id = ?',
                [customer_id]
            );

            const [settingsResults] = await connection.query(
                'SELECT * FROM point_settings ORDER BY id DESC LIMIT 1'
            );

            const customer = customerResults[0];
            const settings = settingsResults[0];

            if (customer && settings && customer.points >= settings.minimum_points_for_discount) {
                const maxDiscount = Math.min(
                    customer.points * settings.discount_per_point, 
                    total_amount
                );
                finalAmount = total_amount - maxDiscount;
                pointsUsed = Math.floor(maxDiscount / settings.discount_per_point);

                // Update customer points
                await connection.query(
                    'UPDATE customers SET points = points - ? WHERE id = ?',
                    [pointsUsed, customer_id]
                );

                // Record points redemption
                await connection.query(
                    'INSERT INTO point_transactions (customer_id, points_redeemed, order_amount) VALUES (?, ?, ?)',
                    [customer_id, pointsUsed, total_amount]
                );
            }
        }

        // Check inventory before creating order
        for (const item of items) {
            const [inventoryCheck] = await connection.query(
                'SELECT quantity FROM items WHERE id = ?',
                [item.id]
            );

            if (!inventoryCheck[0] || inventoryCheck[0].quantity < item.quantity) {
                await connection.rollback();
                return res.status(400).json({ 
                    message: `Insufficient inventory for item ID: ${item.id}` 
                });
            }
        }

        // Create the order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (total_amount, final_amount, customer_id, points_used) VALUES (?, ?, ?, ?)',
            [total_amount, finalAmount, customer_id, pointsUsed]
        );

        const orderId = orderResult.insertId;

        // Insert order items and update inventory
        for (const item of items) {
            await connection.query(
                'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price]
            );

            await connection.query(
                'UPDATE items SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.id]
            );
        }

        // Calculate and add points earned
        if (customer_id) {
            const [settings] = await connection.query(
                'SELECT points_per_amount FROM point_settings ORDER BY id DESC LIMIT 1'
            );
            
            pointsEarned = Math.floor(finalAmount * settings[0].points_per_amount);

            await connection.query(
                'UPDATE customers SET points = points + ?, total_spent = total_spent + ? WHERE id = ?',
                [pointsEarned, finalAmount, customer_id]
            );

            await connection.query(
                'INSERT INTO point_transactions (customer_id, points_earned, order_id, order_amount) VALUES (?, ?, ?, ?)',
                [customer_id, pointsEarned, orderId, finalAmount]
            );
        }

        await connection.commit();

        res.status(201).json({
            message: 'Order created successfully',
            order_id: orderId,
            points_earned: pointsEarned,
            points_used: pointsUsed,
            final_amount: finalAmount
        });

    } catch (error) {
        await connection.rollback();
        console.error('Detailed order creation error:', error);
        res.status(500).json({ 
            message: 'Error creating order', 
            error: error.message 
        });
    } finally {
        connection.release();
    }
};

module.exports = {
    createOrder,
    addPointsForOrder
}; 
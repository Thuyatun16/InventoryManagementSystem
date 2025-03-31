const { db } = require('../config/db');

const findOrCreateCustomer = async (req, res) => {
    const { phone_number } = req.body;

    try {
        // First try to find existing customer
        const findQuery = 'SELECT * FROM customers WHERE phone_number = ?';
        db.query(findQuery, [phone_number], async (err, results) => {
            if (err) {
                console.error('Error finding customer:', err);
                return res.status(500).json({ message: "Database error" });
            }
            if (results.length > 0) {
                // Customer found
                return res.json(results[0]);

            }
            else {
                return res.status(404).json({ message: "Customer not found" });
            }
            // Customer not found, create new
            // const createQuery = 'INSERT INTO customers (phone_number) VALUES (?)';
            // db.query(createQuery, [phone_number], async (err, result) => {
            //     if (err) {
            //         console.error('Error creating customer:', err);
            //         return res.status(500).json({ message: "Error creating customer" });
            //     }

            //     // Return the newly created customer
            //     res.status(201).json({
            //         id: result.insertId,
            //         phone_number,
            //         points: 0,
            //         total_spent: 0
            //     });
            // });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const getCustomerByPhone = async (req, res) => {
    const { phone } = req.params;

    try {
        const query = 'SELECT * FROM customers WHERE phone_number = ?';
        db.query(query, [phone], (err, results) => {
            if (err) {
                console.error('Error finding customer:', err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Customer not found" });
            }

            res.json(results[0]);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const redeemPoints = async (req, res) => {
    const { id } = req.params;
    const { points_to_redeem } = req.body;

    try {
        db.beginTransaction(async (err) => {
            console.log('This is customer Redeem Id', id, "This is points", points_to_redeem);
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

                        // Record the transaction
                        const transactionQuery = `
                            INSERT INTO point_transactions 
                            (customer_id, points_redeemed) 
                            VALUES (?, ?)
                        `;

                        db.query(transactionQuery, [id, points_to_redeem], (err) => {
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

const getPointTransactions = async (req, res) => {
    try {
        const query = `
            SELECT 
            pt.*,
            c.name AS customer_name,
            c.phone_number,
            oh.total_amount
            FROM 
            point_transactions pt
            JOIN 
            customers c ON pt.customer_id = c.id
            JOIN 
            order_history oh ON pt.order_id = oh.order_id
            ORDER BY 
            pt.transaction_date DESC
            LIMIT 100
        `;
        const [transactions] = await db.promise().query(query);
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching point transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

const getPointSettings = async (req, res) => {
    try {
        const query = 'SELECT * FROM point_settings ORDER BY id DESC LIMIT 1';
        const [settings] = await db.promise().query(query);

        if (settings.length === 0) {
            return res.status(404).json({ message: 'Point settings not found' });
        }

        res.json(settings[0]);
    } catch (error) {
        console.error('Error fetching point settings:', error);
        res.status(500).json({ message: 'Error fetching settings' });
    }
};

const updatePointSettings = async (req, res) => {
    const { points_per_amount, discount_per_point, minimum_points_for_discount } = req.body;
    const userId = req.headers['user-id'];

    try {
        // Validate inputs
        console.log('points_per_amount:', points_per_amount, 'discount_per_point:', discount_per_point, 'minimum_points_for_discount:', minimum_points_for_discount);
        if (points_per_amount < 0 || discount_per_point < 0 || minimum_points_for_discount < 0) {
            return res.status(400).json({ message: 'Values cannot be negative' });
        }

        const query = `
            INSERT INTO point_settings 
            (points_per_amount, discount_per_point, minimum_points_for_discount, updated_by) 
            VALUES (?, ?, ?, ?)
        `;

        await db.promise().query(
            query,
            [points_per_amount, discount_per_point, minimum_points_for_discount, userId]
        );

        res.json({ message: 'Point settings updated successfully' });
    } catch (error) {
        console.error('Error updating point settings:', error);
        res.status(500).json({ message: 'Error updating settings' });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        //console.log('this is executed because it was called');
        const query = `
            SELECT 
                c.id,
                c.name,
                c.phone_number,
                c.points,
                c.total_spent,
                c.created_at
            FROM customers c
            ORDER BY c.created_at DESC
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching customers:', err);
                return res.status(500).json({ message: "Database error" });
            }

            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const createCustomer = async (req, res) => {
    const { phone_number, name } = req.body;

    try {
        console.log('phone Number;', phone_number, 'name:', name);
        // Check if phone number already exists
        const checkQuery = 'SELECT id FROM customers WHERE phone_number = ?';
        db.query(checkQuery, [phone_number], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Phone number already registered"
                });
            }

            // Create new customer
            const createQuery = `
                INSERT INTO customers 
                (phone_number, name) 
                VALUES (?, ?)
            `;

            db.query(createQuery, [phone_number, name], (err, result) => {
                if (err) {
                    console.error('Error creating customer:', err);
                    return res.status(500).json({
                        message: "Error creating customer"
                    });
                }

                res.status(201).json({
                    id: result.insertId,
                    phone_number,
                    name,
                    points: 0,
                    total_spent: 0
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { phone_number, name, points, total_spent } = req.body;

    try {
        // Check if phone number exists for other customers
        const checkQuery = `
            SELECT id FROM customers 
            WHERE phone_number = ? AND id != ?
        `;

        db.query(checkQuery, [phone_number, id], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Phone number already used by another customer"
                });
            }

            // Update customer
            const updateQuery = `
                UPDATE customers 
                SET phone_number = ?, name = ?, points = ?, total_spent = ?
                WHERE id = ?
            `;

            db.query(updateQuery, [phone_number, name, points,total_spent, id], (err) => {
                if (err) {
                    console.error('Error updating customer:', err);
                    return res.status(500).json({
                        message: "Error updating customer"
                    });
                }

                res.json({
                    message: "Customer updated successfully",
                    id,
                    phone_number,
                    name,
                    points,
                    total_spent
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if customer has any transactions
        /*   const checkQuery = `
               SELECT COUNT(*) as count 
               FROM point_transactions 
               WHERE customer_id = ?
           `;
   
           db.query(checkQuery, [id], (err, results) => {
               if (err) throw err;
   
               if (results[0].count > 0) {
                   return res.status(400).json({ 
                       message: "Cannot delete customer with existing transactions" 
                   });
               }
   */
        // Delete customer
        const deleteQuery = 'DELETE FROM customers WHERE id = ?';
        db.query(deleteQuery, [id], (err) => {
            if (err) {
                console.error('Error deleting customer:', err);
                return res.status(500).json({
                    message: "Error deleting customer"
                });
            }

            res.json({ message: "Customer deleted successfully" });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    findOrCreateCustomer,
    getCustomerByPhone,
    redeemPoints,
    getPointTransactions,
    getPointSettings,
    updatePointSettings,
    getAllCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer
}; 
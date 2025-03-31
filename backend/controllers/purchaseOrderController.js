const { db } = require('../config/db');
const nodemailer = require('nodemailer');
// Remove this line


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
const sentOrderEmail = async (req, res) => {
    const { to, subject, orderDetails } = req.body;
    try{
        //console.log(to,subject,orderDetails,"test");
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your Gmail email
                pass: process.env.EMAIL_APP_PASSWORD // Your Gmail app password
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            html: `
                <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Purchase Order Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border: 1px solid #dddddd;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #0073e6;
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }
        .header img {
            max-width: 150px;
            margin-bottom: 10px;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content p {
            margin: 10px 0;
        }
        .content strong {
            color: #0073e6;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 15px;
            text-align: center;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
            font-size: 12px;
            color: #666666;
        }
        .footer a {
            color: #0073e6;
            text-decoration: none;
        }
        .footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header Section -->
        <div class="header">
            <img src="https://www.flaticon.com/free-icon/barcode_6215978?term=barcode+scanner&page=1&position=53&origin=search&related_id=6215978" alt="Shop Logo">
            <h2>Purchase Order Details</h2>
        </div>

        <!-- Content Section -->
        <div class="content">
            <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            <p><strong>Item:</strong> ${orderDetails.item}</p>
            <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
            <p><strong>Expected Delivery Date:</strong> ${orderDetails.expectedDate}</p>
            <p>Please confirm receipt of this order.</p>
            <p>Thank you,<br><strong>Shop Owner</strong></p>
        </div>

        <!-- Footer Section -->
        <div class="footer">
            <p>You are receiving this email because you are a registered supplier with us. If you have any questions, please contact us at <a href="mailto:support@shopowner.com">support@shopowner.com</a>.</p>
            <p>&copy; 2025 Shop Owner. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
            `
        };
         // Send email
         await transporter.sendMail(mailOptions);
         res.status(200).json({ message: 'Email sent successfully' });
    }
    catch(err){
        console.error('Error sending email:',err);
        res.status(500).json({ message: 'Failed to send email' });
    }
    };

module.exports = {
    getAllOrders,
    createOrder,
    receiveOrder,
    deleteOrder,
    sentOrderEmail
};
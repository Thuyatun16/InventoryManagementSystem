const { db } = require('../config/db');

const getAllSuppliers = async (req, res) => {
    try {
        //console.log('this is executed because it was called');
        const query = `
            SELECT 
                s.id,
                s.name,
                s.phone_number,
                s.email,
                s.address,
                s.created_at
            FROM suppliers s
            ORDER BY s.created_at DESC
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error('Error fetching suppliers:', err);
                return res.status(500).json({ message: "Database error" });
            }

            res.json(results);
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const createSupplier = async (req, res) => {
    const { name, phone_number, email, address} = req.body;

    try {
        console.log('phone Number;', phone_number, 'name:', name, 'email:', email, 'address:', address);
        // Check if phone number already exists
        const checkQuery = 'SELECT id FROM suppliers WHERE phone_number = ?';
        db.query(checkQuery, [phone_number], (err, results) => {
            if (err) throw err;

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Phone number already registered"
                });
            }

            // Create new customer
            const createQuery = `
                INSERT INTO suppliers 
                (name, phone_number, email, address) 
                VALUES (?, ?, ?, ?)
            `;

            db.query(createQuery, [name,phone_number,email,address], (err, result) => {
                if (err) {
                    console.error('Error creating customer:', err);
                    return res.status(500).json({
                        message: "Error creating customer"
                    });
                }

                res.status(201).json({
                    id: result.insertId,
                    name,
                    phone_number,
                    email,
                    address
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { name, phone_number, email, address} = req.body;

    try {
        // Check if phone number exists for other customers
        const checkQuery = `
            SELECT id FROM suppliers 
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
                UPDATE suppliers 
                SET name = ?, phone_number = ?, email = ?, address = ?
                WHERE id = ?
            `;

            db.query(updateQuery, [name,phone_number,email,address,id], (err) => {
                if (err) {
                    console.error('Error updating supplier:', err);
                    return res.status(500).json({
                        message: "Error updating supplier"
                    });
                }

                res.json({
                    message: "supplier updated successfully",
                    updatedSupplier: {
                        id,
                        name,
                        phone_number,
                        email,
                        address
                    }
                });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const deleteSupplier = async (req, res) => {
    const { id } = req.params;

    try {
        const deleteQuery = 'DELETE FROM suppliers WHERE id = ?';
        db.query(deleteQuery, [id], (err) => {
            if (err) {
                console.error('Error deleting supplier:', err);
                return res.status(500).json({
                    message: "Error deleting supplier"
                });
            }

            res.json({ message: "Supplier deleted successfully" });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getAllSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier
}; 
const { db } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const registerUser = async (req, res) => {
    const { username, email, phone_number, password} = req.body;
    
    try {
        const isAdmin = email === 'admin@admin.com';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(req.body);
        db.query(
            "INSERT INTO user_table (username, email, phone_number, password, isAdmin) VALUES(?,?,?,?,?)", 
            [username, email, phone_number, hashedPassword, isAdmin], 
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Registration failed" });
                }
                res.status(201).json({ 
                    message: "User registered successfully!",
                    isAdmin: isAdmin
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        db.query(
            "SELECT id, email, password, isAdmin FROM user_table WHERE is_active = TRUE AND email = ?",
            [email],
            async (err, result) => {
                if (err || result.length === 0) {
                    console.log(err);
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                
                const user = result[0];
                if(user.isAdmin !==1){
                     const isMatch = await bcrypt.compare(password, user.password);
                
                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                }
                // Check if user is admin
                const isAdmin = user.email === 'admin@admin.com' || user.isAdmin === 1;

                const token = jwt.sign({ id: user.id, isAdmin: isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
                
                res.status(200).json({
                    message: "Login successful!",
                    userId: user.id,
                    isAdmin: isAdmin,
                    token: token
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
const getUser = async(req, res) => {
   try{
    const query = "SELECT * FROM user_table WHERE isAdmin = 0 AND is_active = TRUE";
   db.query(query,(err,user)=>{
    if(err){
        console.log(err,'database Error');
        return res.status(500).json({ 
            message: 'Failed to fetch Staff', 
            error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
        });
    }
    res.status(200).json(user);
   });
}
catch(error){
    res.status(500).json({ error: "Internal server error" });
}
};
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, phone_number, password } = req.body;
    
    try {
        db.query(
            "UPDATE user_table SET username = ?, email = ?,phone_number=?, password =? WHERE id = ? AND isAdmin = 0",
            [username, email,phone_number,password, id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Update failed" });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found or cannot update admin" });
                }
                res.status(200).json({ message: "User updated successfully!" });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params;
    
    try {
        db.query(
            "UPDATE user_table SET is_active= FALSE WHERE id = ?",
            [id],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ error: "Deletion failed" });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: "User not found or cannot delete admin" });
                }
                res.status(200).json({ message: "User deleted successfully!" });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};
const getAdmin = async (req, res) => {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin@123';

    try {
        // Check if admin exists
        db.query("SELECT * FROM user_table WHERE email = ?", [adminEmail], async (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Failed to check for admin" });
            }

            if (result.length > 0) {
                // Admin exists, return admin data
                return res.status(200).json(result[0]);
            } else {
                // Admin does not exist, create new admin
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                db.query(
                    "INSERT INTO user_table (username, email, phone_number, password, isAdmin) VALUES (?, ?, ?, ?, ?)",
                    ['admin', adminEmail, '1234567890', hashedPassword, 1],
                    (err, result) => {
                        if (err) {
                            return res.status(500).json({ error: "Failed to create admin" });
                        }
                        res.status(201).json({ message: "Admin user created successfully!" });
                    }
                );
            }
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    getAdmin
};
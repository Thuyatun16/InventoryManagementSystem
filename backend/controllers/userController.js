const { db } = require('../config/db');

const registerUser = async (req, res) => {
    const { username, email, phone_number, password} = req.body;
    
    try {
        const isAdmin = email === 'admin@admin.com';
        console.log(req.body);
        db.query(
            "INSERT INTO user_table (username, email, phone_number, password, isAdmin) VALUES(?,?,?,?,?)", 
            [username, email, phone_number, password, isAdmin], 
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
    
    try {
        db.query(
            "SELECT id, email, isAdmin FROM user_table WHERE is_active = TRUE AND email = ? AND password = ?",
            [email, password],
            (err, result) => {
                if (err || result.length === 0) {
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                
                // Check if user is admin
                const isAdmin = email === 'admin@admin.com' || result[0].isAdmin === 1;
                
                res.status(200).json({
                    message: "Login successful!",
                    userId: result[0].id,
                    isAdmin: isAdmin
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

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser
};
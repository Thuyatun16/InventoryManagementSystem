const { db } = require('../config/db');

const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    
    try {
        const isAdmin = email === 'admin@admin.com';
        
        db.query(
            "INSERT INTO user_table (username, email, password, isAdmin) VALUES(?,?,?,?)", 
            [username, email, password, isAdmin], 
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
            "SELECT id, email, isAdmin FROM user_table WHERE email = ? AND password = ?",
            [email, password],
            (err, result) => {
                if (err || result.length === 0) {
                    console.log('Login failed:', { err, result }); // Debug log
                    return res.status(401).json({ message: "Invalid credentials" });
                }
                
                // Debug logs
                console.log('Raw DB result:', result[0]);
                console.log('Email:', result[0].email);
                console.log('isAdmin value from DB:', result[0].isAdmin);
                
                // Check if user is admin
                const isAdmin = email === 'admin@admin.com' || result[0].isAdmin === 1;
                console.log('Final isAdmin value:', isAdmin); // Debug log
                
                res.status(200).json({
                    message: "Login successful!",
                    userId: result[0].id,
                    isAdmin: isAdmin
                });
            }
        );
    } catch (error) {
        console.error('Login error:', error); // Debug log
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    registerUser,
    loginUser
}; 
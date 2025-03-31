const { db } = require('../config/db');

const getAllCategories = async (req, res) => {
    try {
        const query = 'SELECT * FROM categories ORDER BY name';
        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const createCategory = async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const query = 'INSERT INTO categories (name, description) VALUES (?, ?)';
        db.query(query, [name, description], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ 
                message: 'Category created successfully', 
                categoryId: result.insertId 
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const query = 'UPDATE categories SET name = ?, description = ? WHERE id = ?';
        db.query(query, [name, description, id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.status(200).json({ message: 'Category updated successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if category has associated items
        const checkQuery = 'SELECT COUNT(*) as itemCount FROM items WHERE category_id = ?';
        db.query(checkQuery, [id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (results[0].itemCount > 0) {
                return res.status(400).json({ 
                    error: 'Cannot delete category', 
                    message: 'This category has associated items. Please remove or reassign items before deleting.' 
                });
            }

            // If no items are associated, proceed with deletion
            const deleteQuery = 'DELETE FROM categories WHERE id = ?';
            db.query(deleteQuery, [id], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: 'Database error' });
                }
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Category not found' });
                }
                res.status(200).json({ message: 'Category deleted successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

module.exports = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
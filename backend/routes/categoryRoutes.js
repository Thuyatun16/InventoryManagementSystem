const express = require('express');
const router = express.Router();
const { getAllCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
// Public route
router.use(authMiddleware);
router.get('/categories', getAllCategories);

// Admin routes - require authentication
router.post('/categories',  createCategory);
router.put('/categories/:id',  updateCategory);
router.delete('/categories/:id',  deleteCategory);

module.exports = router;
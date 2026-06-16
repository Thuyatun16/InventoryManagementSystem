const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');

router.use(authMiddleware);
router.get('/categories', getAllCategories);

router.post('/categories', requireAdmin, createCategory);
router.put('/categories/:id', requireAdmin, updateCategory);
router.delete('/categories/:id', requireAdmin, deleteCategory);

module.exports = router;

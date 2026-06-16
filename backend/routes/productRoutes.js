const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductByBarcode,
  processSale,
  processCheckout,
  getOrders,
} = require('../controllers/productController');

const {
  getInventoryAnalytics,
  updateAnalytics,
} = require('../controllers/analyticsController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');
// CRUD routes
router.post('/create', authMiddleware, createProduct);
router.get('/read', authMiddleware, getAllProducts);
router.put('/update/:id', authMiddleware, updateProduct);
router.delete('/delete/:id', authMiddleware, deleteProduct);

// Sales routes
router.get('/sell/:barcode', authMiddleware, getProductByBarcode);
router.post('/sell', authMiddleware, processSale);
router.post('/checkout', authMiddleware, processCheckout);

// Order routes
router.get('/orders/all', authMiddleware, requireAdmin, getOrders);
router.get('/orders/:userId', authMiddleware, getOrders);
// analytic routes
router.get('/analytics', authMiddleware, requireAdmin, getInventoryAnalytics);
router.post('/update-analytics', authMiddleware, requireAdmin, updateAnalytics);
module.exports = router;

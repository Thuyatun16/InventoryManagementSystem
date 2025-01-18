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
    getOrders
} = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

// CRUD routes
router.post('/create', createProduct);
router.get('/read', getAllProducts);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);

// Sales routes
router.get('/sell/:barcode', getProductByBarcode);
router.post('/sell', processSale);
router.post('/checkout', processCheckout);

// Order routes
router.get('/orders/all', getOrders); // Admin route - must come before /:userId
router.get('/orders/:userId', getOrders); // User specific orders

module.exports = router; 
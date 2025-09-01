const express = require('express');
const router = express.Router();
const purchaseOrderController = require('../controllers/purchaseOrderController');
const authMiddleware = require('../middlewares/authMiddleware');

// All routes require admin access
router.use(authMiddleware);

// Get all purchase orders
router.get('/purchase-orders', purchaseOrderController.getAllOrders);

// Create new purchase order
router.post('/purchase-orders', purchaseOrderController.createOrder);

// Mark order as received
router.put('/purchase-orders/:id/receive', purchaseOrderController.receiveOrder);

// Delete purchase order (optional)
router.delete('/purchase-orders/:id', purchaseOrderController.deleteOrder);
router.post('/send-order-email',purchaseOrderController.sentOrderEmail);

module.exports = router; 
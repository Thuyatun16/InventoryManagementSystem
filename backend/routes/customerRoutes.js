const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { checkAdmin } = require('../middleware/authMiddleware');

router.use(checkAdmin);
router.get('/customers', customerController.getAllCustomers);
// Customer endpoints
router.post('/customers/find-or-create', customerController.findOrCreateCustomer);
router.get('/customers/:phone', customerController.getCustomerByPhone);
router.post('/customers/:id/points/redeem', customerController.redeemPoints);

// Point settings endpoints (admin only)
router.get('/point-settings', customerController.getPointSettings);
router.put('/point-settings', checkAdmin, customerController.updatePointSettings);

// Add these routes

router.post('/customers', customerController.createCustomer);
router.put('/customers/:id', checkAdmin, customerController.updateCustomer);
router.delete('/customers/:id', checkAdmin, customerController.deleteCustomer);

// Add these routes to your existing customerRoutes.js
router.get('/point-transactions', customerController.getPointTransactions);

module.exports = router; 
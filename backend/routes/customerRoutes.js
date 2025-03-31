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
// Allow both admin and staff to access point transactions
router.get('/point-transactions', (req, res, next) => {
    // Check if user is admin or staff
    const isAdmin = req.headers['is-admin'] === 'true';
    const userId = req.headers['user-id'];
    
    // Allow access if user has valid credentials
    if (userId && (isAdmin || true)) { // Allow all authenticated users with a userId
        next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
}, customerController.getPointTransactions);

module.exports = router;
const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');

router.use(authMiddleware, requireAdmin);
router.get('/suppliers', supplierController.getAllSuppliers);
// Supplier endpoints

router.post('/suppliers', supplierController.createSupplier);
router.put('/suppliers/:id', supplierController.updateSupplier);
router.delete('/suppliers/:id', supplierController.deleteSupplier);

module.exports = router;

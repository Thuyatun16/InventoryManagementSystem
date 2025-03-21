const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { checkAdmin } = require('../middleware/authMiddleware');

router.use(checkAdmin);
router.get('/suppliers', supplierController.getAllSuppliers);
// Supplier endpoints

router.post('/suppliers', supplierController.createSupplier);
router.put('/suppliers/:id', checkAdmin, supplierController.updateSupplier);
router.delete('/suppliers/:id', checkAdmin, supplierController.deleteSupplier);

module.exports = router; 
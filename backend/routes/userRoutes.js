const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getCurrentUser,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const requireAdmin = require('../middlewares/adminMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/staff', authMiddleware, requireAdmin, getUser);
router.put('/staff/:id', authMiddleware, requireAdmin, updateUser);
router.delete('/staff/:id', authMiddleware, requireAdmin, deleteUser);

module.exports = router;

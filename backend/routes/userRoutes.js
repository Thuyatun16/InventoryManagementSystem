const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  getAdmin,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/staff', authMiddleware, getUser);
router.put('/staff/:id', authMiddleware, updateUser);
router.delete('/staff/:id', authMiddleware, deleteUser);
router.get('/seed', getAdmin);

module.exports = router;

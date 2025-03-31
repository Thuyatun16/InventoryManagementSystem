const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, updateUser, deleteUser } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/staff', getUser);
router.put('/staff/:id', updateUser);
router.delete('/staff/:id', deleteUser);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

module.exports = router;

router.post('/signup',userController.createUser);
router.post('/login', userController.loginUser);
router.get('/getUsers/', userController.getUsers);
router.get('/total_users',userController.getTotalUser);

const express = require('express');
const router = express.Router();
const {  register, logout, login, getUserById } = require('../controller/userController');

router.get('/user', getUserById);
router.post('/user/register', register);
router.post('/user/login', login);
router.get('/user', logout);




module.exports = router;
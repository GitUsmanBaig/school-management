const express = require('express');
const router = express.Router();
const { signup, login, logout, getUsers } = require('../Controller/adminController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/allUsers', getUsers);

module.exports = router;

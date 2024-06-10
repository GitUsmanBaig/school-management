const express = require('express');
const router = express.Router();
const { signup, login, logout, getUsers, disableUser,enableUser } = require('../Controller/adminController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/allUsers', getUsers);
router.put('/disableUser/:id', disableUser);
router.put('/enableUser/:id', enableUser);

module.exports = router;

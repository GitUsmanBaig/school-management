const express = require('express');
const router = express.Router();
const { login, logout, getAssignedCourses, getAllStudents } = require('../Controller/teacherController');
const { authenticate_teacher } = require('../Middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/courses/all', authenticate_teacher, getAssignedCourses);
router.get('/students/all/:id', authenticate_teacher, getAllStudents);

module.exports = router;

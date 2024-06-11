const express = require('express');
const router = express.Router();
const { login, logout, getAllCourses, getCourseById, enrollCourse } = require('../Controller/userController');

router.post('/login', login);
router.post('/logout', logout);
router.get('/courses/all', getAllCourses);
router.get('/courses/:id', getCourseById);
router.post('/courses/enroll/:id', enrollCourse);


module.exports = router;

const express = require('express');
const router = express.Router();
const { login, logout, getAllCourses, getCourseById, enrollCourse,unenrollCourse, getEnrolledCourses } = require('../Controller/userController');
const {authenticate_user} = require('../Middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/courses/all',authenticate_user, getAllCourses);
router.get('/courses/:id', authenticate_user, getCourseById);
router.post('/courses/enroll/:id', authenticate_user, enrollCourse);
router.delete('/courses/unenroll/:id', authenticate_user, unenrollCourse);
router.get('/courses/enroll/all', authenticate_user, getEnrolledCourses);

module.exports = router;

const express = require('express');
const router = express.Router();
const { login, logout, getAllCourses, getCourseById, enrollCourse,unenrollCourse, getEnrolledCourses, updateProfile, getUserInfo, checkPassword, getstudentAttendance, getQuizScores } = require('../Controller/userController');
const {authenticate_user} = require('../Middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/user-info', authenticate_user, getUserInfo);
router.get('/courses/all',authenticate_user, getAllCourses);
router.get('/courses/:id', authenticate_user, getCourseById);
router.post('/courses/enroll/:id', authenticate_user, enrollCourse);
router.delete('/courses/unenroll/:id', authenticate_user, unenrollCourse);
router.get('/courses/enroll/all', authenticate_user, getEnrolledCourses);
router.patch('/update', authenticate_user, updateProfile);
router.post('/check-password', authenticate_user, checkPassword);
router.get('/attendance/:courseId', authenticate_user, getstudentAttendance);
router.get('/quiz-scores/:courseId', authenticate_user, getQuizScores);

module.exports = router;

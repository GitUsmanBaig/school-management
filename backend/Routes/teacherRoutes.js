const express = require('express');
const router = express.Router();
const { login, logout, getAssignedCourses, getAllStudents, markAttendance, getAttendance, markQuiz, getQuizScores, getStudentMarks } = require('../Controller/teacherController');
const { authenticate_teacher } = require('../Middleware/authMiddleware');

router.post('/login', login);
router.post('/logout', logout);
router.get('/courses/assigned/all', authenticate_teacher, getAssignedCourses);
router.get('/students/all/:id', authenticate_teacher, getAllStudents);
router.post('/mark-attendance', authenticate_teacher, markAttendance);
router.get('/get-attendance', authenticate_teacher, getAttendance);
router.post('/mark-quiz', authenticate_teacher, markQuiz);
router.get('/quiz-scores/:courseId', authenticate_teacher, getQuizScores);
router.get('/student-marks/:courseId', authenticate_teacher, getStudentMarks);

module.exports = router;

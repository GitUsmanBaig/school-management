const express = require('express');
const router = express.Router();
const {
    signup, login, logout, getUsers, getTeachers,
    disableUser, enableUser, signupUser, signupTeacher, 
    addCourse,assignCourse, getCourses, disableTeacher, enableTeacher, getAssignedTeachers, getEnrolledStudents
} = require('../Controller/adminController');


const {authenticate_admin} = require('../Middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user/all',authenticate_admin, getUsers);
router.get('/teacher/all', authenticate_admin, getTeachers);
router.patch('/user/disable/:id',authenticate_admin, disableUser);
router.patch('/user/enable/:id', authenticate_admin, enableUser);
router.patch('/teacher/disable/:id',authenticate_admin, disableTeacher);
router.patch('/teacher/enable/:id', authenticate_admin, enableTeacher);
router.post('/user/add', authenticate_admin, signupUser);
router.post('/teacher/add', authenticate_admin, signupTeacher);
router.post('/course/add', authenticate_admin, addCourse);
router.post('/course/assign',authenticate_admin, assignCourse);
router.get('/course/all', authenticate_admin, getCourses);
router.get('/course/assign/:id', authenticate_admin, getAssignedTeachers);
router.get('/course/enroll/:id', authenticate_admin, getEnrolledStudents);


module.exports = router;

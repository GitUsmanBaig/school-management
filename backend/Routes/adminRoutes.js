const express = require('express');
const router = express.Router();
const {
    signup, login, logout, getUsers, getTeachers,
    disableUser, enableUser, signupUser, signupTeacher, 
    addCourse, getCourses
} = require('../Controller/adminController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/user/all', getUsers);
router.get('/teacher/all', getTeachers);
router.patch('/user/disable/:id', disableUser);
router.patch('/user/enable/:id', enableUser);
router.post('/user/add', signupUser);
router.post('/teacher/add', signupTeacher);
router.post('/course/add', addCourse);
router.get('/course/all', getCourses);


module.exports = router;

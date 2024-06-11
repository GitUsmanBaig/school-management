const User = require('../Model/User'); 
const Course = require('../Model/Course');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require ('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Login   
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            if (user.disabled === true) {
                return res.status(401).json('User is disabled');
            }
            else{
                const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
                res.cookie('auth_token', token, { httpOnly: true });
                // console.log(token); 
                res.status(200).json(`Login successful for ${user.name}`);
            }
        } else {
            res.status(401).json('Invalid email or password');
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Logout
const logout = (req, res) => {
    res.cookie('auth_token', '', { expires: new Date(0) });
    res.status(200).json(`Logout successful`);
    console.log(req.user);
};


//get All courses
const getAllCourses = async(req,res)=>{
    try{
        const courses = await Course.find();
        res.status(200).json(courses);
    }catch(err){
        res.status(500).json(err.message);
    }
}

//get course by id
const getCourseById = async(req,res)=>{
    try{
        const course = await Course.findById(req.params.id);
        res.status(200).json(course);
    }catch(err){
        res.status(500).json(err.message);
    }
}

//enroll into course
const enrollCourse = async(req,res) => {
    try {
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json("User not authenticated");
        // }
        const user = await User.findById(req.user.id);
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json("Course not found");
        }

        if (user.enrolledCourses.includes(course._id)) {
            return res.status(400).json("Already enrolled in course");
        }

        user.enrolledCourses.push(course._id);
        await user.save();
        if (!course.enrolledstudents) {
            course.enrolledstudents = [];
        }
        course.enrolledstudents.push(user._id);
        await course.save();

        res.status(200).json("Enrolled successfully");
    } catch (err) {
        res.status(500).json(err.message);
    }
};

//unenrll from course uses delete method
const unenrollCourse = async(req,res) => {
    try {
        const user = await User.findById(req.user.id);
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json("Course not found");
        }

        if (!user.enrolledCourses.includes(course._id)) {
            return res.status(400).json("Not enrolled in course");
        }

        user.enrolledCourses = user.enrolledCourses.filter(courseId => courseId.toString() !== course._id.toString());
        await user.save();
        course.enrolledstudents = course.enrolledstudents.filter(studentId => studentId.toString() !== user._id.toString());
        await course.save();
        
        res.status(200).json("Unenrolled successfully");
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}


//get user enrolled courses
const getEnrolledCourses = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).populate('enrolledCourses');
        res.status(200).json(user.enrolledCourses);
    }
    catch(err){
        res.status(500).json(err.message);
    }
}





module.exports = {login, logout, getAllCourses, getCourseById, enrollCourse,unenrollCourse, getEnrolledCourses};

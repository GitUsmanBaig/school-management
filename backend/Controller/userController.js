const User = require('../Model/User'); 
const Course = require('../Model/Course');
const Attendance = require('../Model/Attendance');
const Quiz = require("../Model/Quiz");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require ('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Login   
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && bcrypt.compare(password, user.password)) {
            if (user.disabled === true) {
                return res.status(401).json('User is disabled');
            } else {
                const token = jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
                res.status(200).json({ message: `Login successful for ${user.name}`, token });
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
};


// Get logged-in user info
const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err.message);
    }
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

//update user
const updateProfile = async (req, res) => {
    const { id } = req.user;  
    const { name, email, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) {
            user.name = name;
        }
        if (email) {
            user.email = email;
        }

        if (currentPassword && newPassword) {
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validPassword) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating profile" });
    }
};


const checkPassword = async (req, res) => {
    const { id } = req.user;
    const { currentPassword } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        res.status(200).json({ message: "Password is correct" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error checking password" });
    }
};


const getstudentAttendance = async (req, res) => {
    const { courseId } = req.params;
    const { id } = req.user; 

    try {
        const attendanceRecords = await Attendance.find({ courseId, studentId: id }).populate('courseId', 'courseName');
        
        if (!attendanceRecords.length) {
            return res.status(404).json({ message: "No attendance records found for this course and user" });
        }

        res.status(200).json(attendanceRecords);
    } catch (err) {
        res.status(500).json(err.message);
    }
};



// Get quiz scores for a student
const getQuizScores = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user.id; 
    try {
        const quiz = await Quiz.findOne({ courseId, studentId });
        if (!quiz) {
            return res.status(404).json({ message: 'No quiz scores available' });
        }
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



module.exports = {login, logout, getUserInfo, getAllCourses, getCourseById, enrollCourse,unenrollCourse, getEnrolledCourses, updateProfile, checkPassword, getstudentAttendance, getQuizScores};

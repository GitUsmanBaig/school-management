const Teacher = require('../Model/Teacher'); 
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
        const teacher = await Teacher.findOne({ email });
        if (teacher && await bcrypt.compare(password, teacher.password)) {
            if (teacher.disabled === true) {
                return res.status(401).json('Teacher is disabled');
            } else {
                const token = jwt.sign({ id: teacher._id, role: 'teacher' }, SECRET_KEY, { expiresIn: '1h' });
                res.cookie('auth_token', token, { httpOnly: true });
                res.status(200).json({ message: `Login successful for ${teacher.name}`, token });
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


//get all assigned courses to teacher
const getAssignedCourses = async(req,res)=>{
    try{
        const teacher = await Teacher.findById(req.user.id).populate('assignedCourses');
        res.status(200).json(teacher.assignedCourses);
    }catch(err){
        res.status(500).json(err.message);
    }
}


const getAllStudents = async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await Course.findById(courseId).populate('enrolledstudents');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const students = course.enrolledstudents;
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getAttendance = async (req, res) => {
    const { courseId, date } = req.query;
    try {
        const course = await Course.findById(courseId).populate('enrolledstudents');
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const attendanceRecords = await Attendance.find({ courseId, date: new Date(date) });

        const attendance = course.enrolledstudents.map(student => {
            const record = attendanceRecords.find(r => r.studentId.toString() === student._id.toString());
            return {
                studentId: student,
                present: record ? record.present : false
            };
        });

        res.status(200).json(attendance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// Mark attendance for a specific course and date
const markAttendance = async (req, res) => {
    const { courseId, date, attendance } = req.body;
    try {
        await Attendance.deleteMany({ courseId, date: new Date(date) }); // Clear previous records for the same date
        const attendanceRecords = Object.entries(attendance).map(([studentId, present]) => ({
            courseId,
            studentId,
            date: new Date(date),
            present
        }));
        await Attendance.insertMany(attendanceRecords); // Insert new records

        res.status(200).json({ message: "Attendance marked successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const markQuiz = async (req, res) => {
    const { courseId, studentId, quiz1, quiz2 } = req.body;
    try {
        const quiz = await Quiz.findOneAndUpdate(
            { courseId, studentId },
            { quiz1, quiz2 },
            { new: true, upsert: true }
        );
        res.status(200).json({ message: 'Quiz scores marked successfully', quiz });
    } catch (err) {
        console.error('Failed to mark/update quiz scores:', err);
        res.status(500).json({ message: 'Failed to mark/update quiz scores', err });
    }
};




// Get quiz scores for a student
const getQuizScores = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user.id;
    try {
        const quiz = await Quiz.findOne({ courseId, studentId });
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz scores not found' });
        }
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



const getStudentMarks = async (req, res) => {
    console.log("inside-01");
    const { courseId } = req.params;
    try {
        console.log("inside-try");
        const marks = await Quiz.find({ courseId }).populate('studentId', 'name email');
        if (!marks.length) {
            return res.status(404).json({ message: "No marks found for this course" });
        }
        res.status(200).json(marks);
    } catch (err) {
        console.error("Error fetching student marks:", err);
        res.status(500).json({ message: "Failed to fetch marks", err });
    }
};








module.exports = {login, logout,getAssignedCourses , getAllStudents, markAttendance, getAttendance, markQuiz, getQuizScores, getStudentMarks};

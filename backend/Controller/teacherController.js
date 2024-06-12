const Teacher = require('../Model/Teacher'); 
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
                return res.status(401).json('teacher is disabled');
            }
            else {
                // Include the role in the token
                const token = jwt.sign({ id: teacher._id, role: 'teacher' }, SECRET_KEY, { expiresIn: '1hr' });
                res.cookie('auth_token', token, { httpOnly: true });
                res.status(200).json(`Login successful for ${teacher.name}`);
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
    try {
        const courseId = req.params.id; 
        const teacher = await Teacher.findById(req.user.id).populate({
            path: 'assignedCourses',
            populate: { path: 'enrolledstudents' }
        });

        const course = teacher.assignedCourses.find(course => course._id.toString() === courseId);

        if (!course) {
            return res.status(403).json("Access Denied. This course is not assigned to you.");
        }

        const students = course.enrolledstudents.map(student => ({
            id: student._id,
            name: student.name,
            email: student.email
        }));

        res.status(200).json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json(err.message);
    }
};


module.exports = {login, logout,getAssignedCourses , getAllStudents};

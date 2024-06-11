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
            else{
                const token = jwt.sign({ id: teacher._id }, SECRET_KEY, { expiresIn: '1d' });
                res.cookie('auth_token', token, { httpOnly: true });
                // console.log(token); 
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

//get All students enrolled in course id assigned to teacher
const getAllStudents = async(req,res)=>{
    try{
        const teacher = await Teacher.findById(req.user.id).populate('assignedCourses');
        const students = teacher.assignedCourses.map(course => course.students);
        res.status(200).json(students);
    }catch(err){
        res.status(500).json(err.message);
    }
}

module.exports = {login, logout, getAllStudents};

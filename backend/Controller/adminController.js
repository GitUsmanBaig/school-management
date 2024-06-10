const Admin = require('../Model/Admin');
const User = require('../Model/User'); 
const Teacher = require('../Model/Teacher');
const Course = require('../Model/Course');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require ('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Signup
const signup = async (req, res) => {
    const { name, email, password, CNIC, contact } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const admin = new Admin({ name, email, password: hashedPassword, CNIC, contact, disabled: false });
        await admin.save();
        res.status(201).json(`Admin ${name} created successfully`);
    } catch (err) {
        res.status(422).json(err.message);
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne ({ email });
        if (admin && await bcrypt.compare(password, admin.password)) {
            const token = jwt.sign({ id: admin._id, role: admin.role }, SECRET_KEY, { expiresIn: '1hr' });
            res.cookie('auth_token', token, { httpOnly: true });
            // console.log(token); 
            res.status(200).json(`Login successful for ${admin.name}`);
        } else {
            res.status(401).json('Invalid email or password');
        }
    }catch (err) {
        res.status(500).json(err.message);
    }
}

// Logout
const logout = (req, res) => {
    res.cookie('auth_token', '', { expires: new Date(0) });
    res.status(200).json(`Logout successful`);
    console.log(req.user);
};



// Signup User
const signupUser = async (req, res) => {
    const { name, email, password, CNIC, contact } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name, email, password: hashedPassword, CNIC, contact, disabled: false
        });
        await user.save();
        res.status(201).json(`User ${name} created successfully`);
    } catch (err) {
        res.status(422).json(err.message);
    }
};

// Signup Teacher
const signupTeacher = async (req, res) => {
    const { name, email, password, CNIC, contact, subject, qualifications } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const teacher = new Teacher({
            name, email, password: hashedPassword, CNIC, contact, subject, qualifications, disabled: false
        });
        await teacher.save();
        res.status(201).json(`Teacher ${name} created successfully`);
    } catch (err) {
        res.status(422).json(err.message);
    }
};


//get lists of all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

//get lists of all teachers
const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json(teachers);
    } catch (err) {
        res.status(500).json(err.message);
    }
};


//disable Users
const disableUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (user) {
            user.disabled = true;
            await user.save();
            res.status(200).json(`User ${user.name} disabled successfully`);
        } else {
            res.status(404).json(`User not found`);
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}

//enable Users
const enableUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (user) {
            user.disabled = false;
            await user.save();
            res.status(200).json(`User ${user.name} enabled successfully`);
        } else {
            res.status(404).json(`User not found`);
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}


const addCourse = async (req, res) => {
    const { courseId, courseName, startDate, endDate, teacherIds } = req.body;
    try {
        const course = new Course({
            courseId,
            courseName,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            assignedTeachers: teacherIds  
        });
        await course.save();
        //update each teacher's profile to include this course
        await Teacher.updateMany(
            { _id: { $in: teacherIds } },
            { $push: { assignedCourses: course._id } }
        );

        res.status(201).json({ message: `Course ${courseName} created successfully and teachers assigned`, course });
    } catch (err) {
        res.status(500).json(err.message);
    }
};


//get all courses
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

module.exports = { signup, login, logout, signupUser , signupTeacher, getUsers, getTeachers, disableUser, enableUser, addCourse, getCourses};

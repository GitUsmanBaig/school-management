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
        const admin = new Admin({ name, email, password: hashedPassword, CNIC, contact, disabled: true }); // disabled by default
        await admin.save();
        res.status(201).json(`Admin ${name} created successfully`);
    } catch (err) {
        res.status(422).json(err.message);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        if (admin) {
            if (admin.disabled) {
                return res.status(401).json('Admin account is disabled.');
            }

            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (isPasswordValid) {
                const token = jwt.sign({ id: admin._id, role: admin.role }, SECRET_KEY, { expiresIn: '1hr' });
                res.status(200).json({ message: `Login successful for ${admin.name}` });
            } else {
                res.status(401).json('Invalid email or password');
            }
        } else {
            res.status(401).json('Invalid email or password');
        }
    } catch (err) {
        res.status(500).json(err.message);
    }
};


// Get pending admin requests
const getPendingAdmins = async (req, res) => {
    try {
        const pendingAdmins = await Admin.find({ disabled: true });
        res.status(200).json(pendingAdmins);
    } catch (err) {
        res.status(500).json(err.message);
    }
};

// Approve admin request
const approveAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await Admin.findById(id);
        if (admin) {
            admin.disabled = false;
            await admin.save();
            res.status(200).json(`Admin ${admin.name} enabled successfully`);
        } else {
            res.status(404).json(`Admin not found`);
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

//disable teachers
const disableTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await Teacher.findById(id);
        if (teacher) {
            teacher.disabled = true;
            await teacher.save();
            res.status(200).json(`Teacher ${teacher.name} disabled successfully`);
        } else {
            res.status(404).json(`Teacher not found`);
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}

//enable teachers
const enableTeacher = async (req, res) => {
    const { id } = req.params;
    try {
        const teacher = await Teacher.findById(id);
        if (teacher) {
            teacher.disabled = false;
            await teacher.save();
            res.status(200).json(`Teacher ${teacher.name} enabled successfully`);
        } else {
            res.status(404).json(`Teacher not found`);
        }
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}

//add course
const addCourse = async (req, res) => {
    const { courseId, courseName, startDate, endDate } = req.body;
    try {
        const existingCourse = await Course.findOne({ courseId });
        if (existingCourse) {
            return res.status(409).json({ message: "Course ID already exists" });
        }

        const course = new Course({
            courseId,
            courseName,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            assignedTeachers: []  
        });
        await course.save();

        res.status(201).json({ message: `Course ${courseName} created successfully`, course });
    } catch (err) {
        res.status(500).json(err.message);
    }
};


const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: `Course ${course.courseName} deleted successfully` });
    } catch (err) {
        res.status(500).json(err.message);
    }
};


//assign teacher to course
const assignCourse = async (req, res) => {
    const { courseId } = req.params;
    const { teacherIds } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Add teachers to the course, ensuring no duplicates
        const uniqueTeacherIds = [...new Set([...course.assignedTeachers, ...teacherIds])];
        course.assignedTeachers = uniqueTeacherIds;
        await course.save();

        // Optionally, update each teacher's profile to include this course
        await Teacher.updateMany(
            { _id: { $in: teacherIds } },
            { $push: { assignedCourses: course._id } }
        );

        res.status(200).json({ message: `Teachers assigned to course ${course.courseName} successfully`, course });
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


//get list of teacher assigned to a course
const getAssignedTeachers = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findOne({ _id: id }).populate('assignedTeachers');
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course.assignedTeachers);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}


//get lsit of students enrolled to a course
const getEnrolledStudents = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findOne({ _id: id }).populate('enrolledstudents');
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course.enrolledstudents);
    }
    catch (err) {
        res.status(500).json(err.message);
    }
}



module.exports = { signup, login,approveAdmin, getPendingAdmins, logout, signupUser , signupTeacher, getUsers, getTeachers, disableUser, enableUser,disableTeacher,enableTeacher, addCourse,deleteCourse, assignCourse, getCourses, getAssignedTeachers, getEnrolledStudents};

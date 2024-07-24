const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const attendanceSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    present: { type: Boolean, required: true },
});

const CourseSchema = new Schema({
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    courseName: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    assignedTeachers: [{
        type: Schema.Types.ObjectId,
        ref: 'TeacherProfile'
    }],
    enrolledstudents: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'UserProfile'
        }],
        default: []
    },
     attendanceRecords: [attendanceSchema] 
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    }
});

const Course = mongoose.model('Course', CourseSchema);
module.exports = Course;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    CNIC: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'teacher'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    subject: {
        type: String,
        required: true
    },
    qualifications: {
        type: [String],
        default: []
    },
    assignedCourses: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Course'
        }],
        default: []
    }
    
});


const TeacherProfile = mongoose.model('TeacherProfile', TeacherSchema);
module.exports = TeacherProfile;

const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    present: { type: Boolean, required: true },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;

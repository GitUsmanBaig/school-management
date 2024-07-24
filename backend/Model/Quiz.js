const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true }, 
    quiz1: { type: Number, required: true, default: 0 },
    quiz2: { type: Number, required: true, default: 0 },
});

const Quiz = mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;

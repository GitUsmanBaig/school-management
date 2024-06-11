const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    CNIC: String,
    contact: String,
    role : {
        type: String,
        default: 'user',
    },
    disabled:{
        type: Boolean,
        default: false
    },
    enrolledCourses: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Course'
        }],
        default: []
    }
});

const UserProfile = mongoose.model('UserProfile', UserSchema);
module.exports = UserProfile;
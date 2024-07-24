const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    name: String,
    email: String,
    password: String,
    CNIC: String,
    contact: String,
    role : {
        type: String,
        default: 'admin',
    },
    disabled: {
        type: Boolean,
        default: true,
    }
});

const AdminProfile = mongoose.model('AdminProfile', AdminSchema);
module.exports = AdminProfile;
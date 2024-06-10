const User = require('../Model/User'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require ('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

// Signup
const signup = async (req, res) => {
    const { name, email, password, CNIC, contact } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ name, email, password: hashedPassword, CNIC, contact, disabled: false });
        await user.save();
        res.status(201).json(`User ${name} created successfully`);
    } catch (err) {
        res.status(422).json(err.message);
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
            res.cookie('auth_token', token, { httpOnly: true });
            // console.log(token); 
            res.status(200).json(`Login successful for ${user.name}`);
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
    console.log(req.user);
};

module.exports = { signup, login, logout};

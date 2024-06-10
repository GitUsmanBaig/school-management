const User = require('../Model/User'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require ('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
;

// Login   
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await bcrypt.compare(password, user.password)) {
            if (user.disabled === true) {
                return res.status(401).json('User is disabled');
            }
            else{
                const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
                res.cookie('auth_token', token, { httpOnly: true });
                // console.log(token); 
                res.status(200).json(`Login successful for ${user.name}`);
            }
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

module.exports = {login, logout};

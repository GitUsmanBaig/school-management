const jwt = require('jsonwebtoken');
require ('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const authenticate_user = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).send('Access Denied. Please login first.');
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token. Please login again.');
    }
};


const authenticate_admin = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) return res.status(401).send('Access Denied. Please login first.');

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        if (verified.role !== 'admin') return res.status(401).send('Access Denied. Admin access required.');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token. Please login again.');
    }
};


module.exports = { authenticate_user, authenticate_admin };
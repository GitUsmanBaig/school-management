const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config();

if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in the environment variables");
}

const app = express();
app.use(cookieParser());
app.use(express.json());

const User = require('../Model/User');
const Course = require('../Model/Course');
const userRoutes = require('../Routes/userRoutes');

// Middleware to set the user in req.user
app.use((req, res, next) => {
    if (req.cookies.auth_token) {
        try {
            const decoded = jwt.verify(req.cookies.auth_token, process.env.SECRET_KEY);
            req.user = { id: decoded.id, role: decoded.role };
        } catch (err) {
            return res.status(401).json('Unauthorized');
        }
    }
    next();
});

// Use user routes
app.use('/api/users', userRoutes);

describe('User Controller', () => {
    beforeAll(async () => {
        const mongoUrl = process.env.MONGODB_URL;
        await mongoose.connect(mongoUrl);
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Course.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('POST /api/users/login', () => {
        it('should login a user with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 12);
            const user = new User({
                name: 'Ali',
                email: 'ali@example.com',
                password: hashedPassword,
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                disabled: false
            });
            await user.save();

            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'ali@example.com', password: 'password123' });

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe(`Login successful for ${user.name}`);
        });

        it('should not login a user with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'wrong@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toBe(401);
            expect(JSON.parse(res.text)).toBe('Invalid email or password');
        });
    });

    describe('POST /api/users/logout', () => {
        it('should logout a user', async () => {
            const res = await request(app)
                .post('/api/users/logout');

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe('Logout successful');
        });
    });

    describe('GET /api/users/courses/all', () => {
        it('should get all courses', async () => {
            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date()
            });
            await course.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'user' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get('/api/users/courses/all')
                .set('Cookie', `auth_token=${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ courseId: 'C1', courseName: 'Course 1' })
            ]));
        });
    });

    describe('GET /api/users/courses/:id', () => {
        it('should get a course by ID', async () => {
            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date()
            });
            await course.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'user' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get(`/api/users/courses/${course._id}`)
                .set('Cookie', `auth_token=${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.objectContaining({ courseId: 'C1', courseName: 'Course 1' }));
        });
    });

    describe('POST /api/users/courses/enroll/:id', () => {
        it('should enroll a user in a course', async () => {
            const user = new User({
                name: 'Ali',
                email: 'ali@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                disabled: false
            });
            await user.save();

            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date(),
                enrolledstudents: []
            });
            await course.save();

            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

            const res = await request(app)
                .post(`/api/users/courses/enroll/${course._id}`)
                .set('Cookie', `auth_token=${token}`);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe('Enrolled successfully');
        });
    });

    describe('DELETE /api/users/courses/unenroll/:id', () => {
        it('should unenroll a user from a course', async () => {
            const user = new User({
                name: 'Ali',
                email: 'ali@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                disabled: false,
                enrolledCourses: []
            });
            await user.save();

            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date(),
                enrolledstudents: []
            });
            await course.save();

            user.enrolledCourses.push(course._id);
            await user.save();

            course.enrolledstudents.push(user._id);
            await course.save();

            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

            const res = await request(app)
                .delete(`/api/users/courses/unenroll/${course._id}`)
                .set('Cookie', `auth_token=${token}`);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe('Unenrolled successfully');
        });
    });

    describe('GET /api/users/courses/enroll/all', () => {
        it('should get all enrolled courses for a user', async () => {
            const user = new User({
                name: 'Ali',
                email: 'ali@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                disabled: false,
                enrolledCourses: []
            });
            await user.save();

            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date()
            });
            await course.save();

            user.enrolledCourses.push(course._id);
            await user.save();

            const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

            const res = await request(app)
                .get('/api/users/courses/enroll/all')
                .set('Cookie', `auth_token=${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ courseId: 'C1', courseName: 'Course 1' })
            ]));
        });
    });
});

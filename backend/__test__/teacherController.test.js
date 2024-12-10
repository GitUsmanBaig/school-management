const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in the environment variables");
}

const app = express();
app.use(cookieParser());
app.use(express.json());

const Teacher = require('../Model/Teacher');
const Course = require('../Model/Course');
const User = require('../Model/User');
const teacherRoutes = require('../Routes/teacherRoutes');

app.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = { id: decoded.id, role: decoded.role };
        } catch (err) {
            return res.status(401).json('Unauthorized');
        }
    }
    next();
});

app.use('/api/teachers', teacherRoutes);

describe('Teacher Controller', () => {
    beforeAll(async () => {
        const mongoUrl = process.env.MONGODB_URL;
        await mongoose.connect(mongoUrl);
    });

    beforeEach(async () => {
        await Teacher.deleteMany({});
        await Course.deleteMany({});
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('POST /api/teachers/login', () => {
        it('should login a teacher with valid credentials', async () => {
            const teacher = new Teacher({ 
                email: 'teacher@example.com', 
                password: await bcrypt.hash('password123', 10), 
                name: 'Usman', 
                disabled: false,
                subject: 'Math',
                contact: '1234567890',
                CNIC: '12345-6789012-3'
            });
            await teacher.save();

            const res = await request(app)
                .post('/api/teachers/login')
                .send({ email: 'teacher@example.com', password: 'password123' });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe(`Login successful for ${teacher.name}`);
        });

        it('should not login a teacher with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/teachers/login')
                .send({ email: 'wrong@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toBe(401);
            expect(res.body).toBe('Invalid email or password');
        });

        it('should not login a disabled teacher', async () => {
            const teacher = new Teacher({ 
                email: 'teacher@example.com', 
                password: await bcrypt.hash('password123', 10), 
                name: 'Usman', 
                disabled: true,
                subject: 'Math',
                contact: '1234567890',
                CNIC: '12345-6789012-3'
            });
            await teacher.save();

            const res = await request(app)
                .post('/api/teachers/login')
                .send({ email: 'teacher@example.com', password: 'password123' });

            expect(res.statusCode).toBe(401);
            expect(res.body).toBe('Teacher is disabled');
        });
    });

    describe('POST /api/teachers/logout', () => {
        it('should logout a teacher', async () => {
            const res = await request(app)
                .post('/api/teachers/logout');

            expect(res.statusCode).toBe(200);
            expect(res.body).toBe('Logout successful');
        });
    });

    describe('GET /api/teachers/courses/all', () => {
        it('should get all assigned courses for a teacher', async () => {
            const teacher = new Teacher({ 
                email: 'teacher2@example.com', 
                password: await bcrypt.hash('password123', 10), 
                name: 'Ali', 
                disabled: false,
                subject: 'Math',
                contact: '1234567890',
                CNIC: '12345-6789012-3'
            });
            await teacher.save();

            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date(),
                assignedTeachers: [teacher._id]
            });
            await course.save();

            teacher.assignedCourses.push(course._id);
            await teacher.save();

            const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get('/api/teachers/courses/all')
                .set('Authorization', token);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ courseId: 'C1', courseName: 'Course 1' })
            ]));
        });
    });

    describe('GET /api/teachers/students/all/:id', () => {
        it('should get all students for an assigned course', async () => {
            const teacher = new Teacher({ 
                email: 'teacher3@example.com', 
                password: await bcrypt.hash('password123', 10), 
                name: 'John Doe', 
                disabled: false,
                subject: 'Math',
                contact: '1234567890',
                CNIC: '12345-6789012-3'
            });
            await teacher.save();

            const student = new User({
                name: 'Student1',
                email: 'student1@example.com',
                password: 'password123',
                CNIC: '23456-7890123-4',
                contact: '0987654321',
                enrolledCourses: []
            });
            await student.save();

            const course = new Course({
                courseId: 'C2',
                courseName: 'Course 2',
                startDate: new Date(),
                endDate: new Date(),
                assignedTeachers: [teacher._id],
                enrolledstudents: [student._id]
            });
            await course.save();

            teacher.assignedCourses.push(course._id);
            await teacher.save();

            student.enrolledCourses.push(course._id);
            await student.save();

            const token = jwt.sign({ id: teacher._id, role: 'teacher' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get(`/api/teachers/students/all/${course._id}`)
                .set('Authorization', token);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ name: 'Student1', email: 'student1@example.com' })
            ]));
        });
    });
});
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not defined in the environment variables");
}

const app = express();
app.use(express.json());

const Admin = require('../Model/Admin');
const User = require('../Model/User');
const Teacher = require('../Model/Teacher');
const Course = require('../Model/Course');
const adminRoutes = require('../Routes/adminRoutes');

// Middleware to simulate local storage token verification
app.use((req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer TOKEN
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = { id: decoded.id, role: decoded.role };
        } catch (err) {
            return res.status(401).json('Unauthorized');
        }
    }
    next();
});

// Use admin routes
app.use('/api/admin', adminRoutes);

describe('Admin Controller', () => {
    beforeAll(async () => {
        const mongoUrl = process.env.MONGODB_URL;
        await mongoose.connect(mongoUrl);
    });

    beforeEach(async () => {
        await Admin.deleteMany({});
        await User.deleteMany({});
        await Teacher.deleteMany({});
        await Course.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('POST /api/admin/signup', () => {
        it('should sign up a new admin', async () => {
            const adminData = {
                name: 'Usman',
                email: 'usman@example.com',
                password: 'password123',
                CNIC: '12345-6789012-3',
                contact: '1234567890'
            };

            const res = await request(app)
                .post('/api/admin/signup')
                .send(adminData);

            expect(res.statusCode).toBe(201);
            expect(JSON.parse(res.text)).toBe(`Admin ${adminData.name} created successfully`);
        });
    });

    describe('POST /api/admin/login', () => {
        it('should login an admin with valid credentials', async () => {
            const hashedPassword = await bcrypt.hash('password123', 12);
            const admin = new Admin({
                name: 'Usman',
                email: 'usman@example.com',
                password: hashedPassword,
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                disabled: false
            });
            await admin.save();

            const res = await request(app)
                .post('/api/admin/login')
                .send({ email: 'usman@example.com', password: 'password123' });

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe(`Login successful for ${admin.name}`);
        });

        it('should not login an admin with invalid credentials', async () => {
            const res = await request(app)
                .post('/api/admin/login')
                .send({ email: 'wrong@example.com', password: 'wrongpassword' });

            expect(res.statusCode).toBe(401);
            expect(JSON.parse(res.text)).toBe('Invalid email or password');
        });
    });

    describe('POST /api/admin/logout', () => {
        it('should logout an admin', async () => {
            const res = await request(app)
                .post('/api/admin/logout');

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe('Logout successful');
        });
    });

    describe('POST /api/admin/signupUser', () => {
        it('should sign up a new user', async () => {
            const userData = {
                name: 'Ali',
                email: 'ali@example.com',
                password: 'password123',
                CNIC: '12345-6789012-3',
                contact: '1234567890'
            };

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .post('/api/admin/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send(userData);

            expect(res.statusCode).toBe(201);
            expect(JSON.parse(res.text)).toBe(`User ${userData.name} created successfully`);
        });
    });

    describe('POST /api/admin/signupTeacher', () => {
        it('should sign up a new teacher', async () => {
            const teacherData = {
                name: 'Sarah',
                email: 'sarah@example.com',
                password: 'password123',
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                subject: 'Math',
                qualifications: ['PhD']
            };

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .post('/api/admin/teacher/add')
                .set('Authorization', `Bearer ${token}`)
                .send(teacherData);

            expect(res.statusCode).toBe(201);
            expect(JSON.parse(res.text)).toBe(`Teacher ${teacherData.name} created successfully`);
        });
    });

    describe('GET /api/admin/user/all', () => {
        it('should get the list of all users', async () => {
            const user = new User({
                name: 'Ali',
                email: 'ali@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                disabled: false
            });
            await user.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get('/api/admin/user/all')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ name: 'Ali', email: 'ali@example.com' })
            ]));
        });
    });

    describe('GET /api/admin/teacher/all', () => {
        it('should get the list of all teachers', async () => {
            const teacher = new Teacher({
                name: 'Sarah',
                email: 'sarah@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                subject: 'Math',
                qualifications: ['PhD'],
                disabled: false
            });
            await teacher.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get('/api/admin/teacher/all')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ name: 'Sarah', email: 'sarah@example.com' })
            ]));
        });
    });

    describe('PATCH /api/admin/user/disable/:id', () => {
        it('should disable a user', async () => {
            const user = new User({
                name: 'Ali',
                email: 'ali@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                disabled: false
            });
            await user.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .patch(`/api/admin/user/disable/${user._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe(`User ${user.name} disabled successfully`);
        });
    });

    describe('PATCH /api/admin/user/enable/:id', () => {
        it('should enable a user', async () => {
            const user = new User({
                name: 'Ali',
                email: 'ali@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                disabled: true
            });
            await user.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .patch(`/api/admin/user/enable/${user._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe(`User ${user.name} enabled successfully`);
        });
    });

    describe('PATCH /api/admin/teacher/disable/:id', () => {
        it('should disable a teacher', async () => {
            const teacher = new Teacher({
                name: 'Sarah',
                email: 'sarah@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                subject: 'Math',
                qualifications: ['PhD'],
                disabled: false
            });
            await teacher.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .patch(`/api/admin/teacher/disable/${teacher._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe(`Teacher ${teacher.name} disabled successfully`);
        });
    });

    describe('PATCH /api/admin/teacher/enable/:id', () => {
        it('should enable a teacher', async () => {
            const teacher = new Teacher({
                name: 'Sarah',
                email: 'sarah@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                subject: 'Math',
                qualifications: ['PhD'],
                disabled: true
            });
            await teacher.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .patch(`/api/admin/teacher/enable/${teacher._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(JSON.parse(res.text)).toBe(`Teacher ${teacher.name} enabled successfully`);
        });
    });

    describe('POST /api/admin/course/add', () => {
        it('should add a new course', async () => {
            const courseData = {
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date()
            };

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .post('/api/admin/course/add')
                .set('Authorization', `Bearer ${token}`)
                .send(courseData);

            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe(`Course ${courseData.courseName} created successfully`);
        });
    });

    describe('POST /api/admin/course/assign', () => {
        it('should assign teachers to a course', async () => {
            const teacher1 = new Teacher({
                name: 'Sarah',
                email: 'sarah@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                subject: 'Math',
                qualifications: ['PhD'],
                disabled: false
            });
            await teacher1.save();

            const teacher2 = new Teacher({
                name: 'Ali',
                email: 'ali@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-4',
                contact: '1234567890',
                subject: 'Science',
                qualifications: ['PhD'],
                disabled: false
            });
            await teacher2.save();

            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date(),
                assignedTeachers: []
            });
            await course.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .post('/api/admin/course/assign')
                .set('Authorization', `Bearer ${token}`)
                .send({ courseId: 'C1', teacherIds: [teacher1._id, teacher2._id] });

            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe(`Teachers assigned to course ${course.courseName} successfully`);
        });
    });

    describe('GET /api/admin/course/all', () => {
        it('should get all courses', async () => {
            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date()
            });
            await course.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get('/api/admin/course/all')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ courseId: 'C1', courseName: 'Course 1' })
            ]));
        });
    });

    describe('GET /api/admin/course/assign/:id', () => {
        it('should get the list of teachers assigned to a course', async () => {
            const teacher1 = new Teacher({
                name: 'Sarah',
                email: 'sarah@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-3',
                contact: '1234567890',
                subject: 'Math',
                qualifications: ['PhD'],
                disabled: false
            });
            await teacher1.save();

            const teacher2 = new Teacher({
                name: 'Ali',
                email: 'ali@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-4',
                contact: '1234567890',
                subject: 'Science',
                qualifications: ['PhD'],
                disabled: false
            });
            await teacher2.save();

            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date(),
                assignedTeachers: [teacher1._id, teacher2._id]
            });
            await course.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get(`/api/admin/course/assign/${course._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ name: 'Sarah', email: 'sarah@example.com' }),
                expect.objectContaining({ name: 'Ali', email: 'ali@example.com' })
            ]));
        });
    });

    describe('GET /api/admin/course/enroll/:id', () => {
        it('should get the list of students enrolled in a course', async () => {
            const student = new User({
                name: 'Abdullah',
                email: 'abdullah@example.com',
                password: await bcrypt.hash('password123', 12),
                CNIC: '12345-6789012-5',
                contact: '1234567890',
                disabled: false
            });
            await student.save();

            const course = new Course({
                courseId: 'C1',
                courseName: 'Course 1',
                startDate: new Date(),
                endDate: new Date(),
                enrolledstudents: [student._id]
            });
            await course.save();

            const token = jwt.sign({ id: new mongoose.Types.ObjectId(), role: 'admin' }, process.env.SECRET_KEY, { expiresIn: '1hr' });

            const res = await request(app)
                .get(`/api/admin/course/enroll/${course._id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(expect.arrayContaining([
                expect.objectContaining({ name: 'Abdullah', email: 'abdullah@example.com' })
            ]));
        });
    });
});
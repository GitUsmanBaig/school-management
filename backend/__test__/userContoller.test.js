const supertest = require('supertest')
const app = require('../server');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../env' });


describe('User Endpoints', () => {
  beforeAll(async () => {
    // Connect to a Mongo DB
    await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const res = await supertest(app)
      .post('/api/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        CNIC: '12345-1234567-1',
        contact: '0123456789'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('John Doe');
  });

  it('should fail to login with wrong credentials', async () => {
    const res = await supertest(app)
      .post('/api/users/login')
      .send({
        email: 'john@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
  });
});

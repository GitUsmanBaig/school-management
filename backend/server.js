const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');
const cors = require('cors'); 

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(express.json()); 

app.use(cors({
  origin: 'http://localhost:4200',
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.options('*', cors());

mongoose.connect(process.env.MONGODB_URL).then(() => console.log('Connected to MongoDB'))
    .catch(error => console.log(error.reason));

const userRoutes = require('./Routes/userRoutes');
app.use('/api/users', userRoutes);

const adminRoutes = require('./Routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const teacherRoutes = require('./Routes/teacherRoutes');
app.use('/api/teachers', teacherRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

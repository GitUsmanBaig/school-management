const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json()); 

mongoose.connect(process.env.MONGODB_URL).then(console.log('Connected to MongoDB'))
    .catch(error => console.log(error.reason));

const userRoutes = require('./Routes/userRoutes');
app.use('/api/users', userRoutes);

const adminRoutes = require('./Routes/adminRoutes');
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

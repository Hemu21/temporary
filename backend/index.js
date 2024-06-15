const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const cors = require('cors');
require('dotenv').config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

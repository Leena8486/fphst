const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/adminUserRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const adminMaintenanceRoutes = require('./routes/adminMaintenanceRoutes');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/rooms', roomRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/residents/maintenance', maintenanceRoutes); // <-- FIXED PATH
app.use('/api/admin', adminMaintenanceRoutes);
// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

module.exports = app;

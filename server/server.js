require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const userRoutes = require('./routes/adminUserRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const staffRoutes = require('./routes/staffRoutes');
const residentRoutes = require('./routes/residentRoutes');
const adminMaintenanceRoutes = require('./routes/adminMaintenanceRoutes');

const app = express();

// ✅ Middleware
app.use(cookieParser());
app.use(cors({
  origin: 'https://fphstm.netlify.app', // Adjust based on your frontend domain
  credentials: true
}));
app.use(express.json());

// ✅ Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes); // Make sure routes in userRoutes are like router.get('/')
app.use('/api/admin/rooms', roomRoutes); // Make sure routes in roomRoutes are like router.get('/')
app.use('/api/admin/maintenance', adminMaintenanceRoutes); // This covers admin-level maintenance

app.use('/api/maintenance', maintenanceRoutes); // Resident or shared
app.use('/api/payments', paymentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/residents', residentRoutes);

// ✅ Health check route
app.get('/', (req, res) => res.send('API running successfully'));

// ✅ Start server after DB is connected
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}\n`);

      // Optional: Log all registered routes
      if (app._router) {
        console.log('✅ Registered routes:');
        app._router.stack.forEach((middleware) => {
          if (middleware.route) {
            console.log(`  ${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
          } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
              if (handler.route) {
                console.log(`  ${Object.keys(handler.route.methods).join(',').toUpperCase()} ${handler.route.path}`);
              }
            });
          }
        });
      } else {
        console.log('⚠️ No routes registered yet');
      }
    });
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

startServer();

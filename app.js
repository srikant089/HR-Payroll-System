const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');

const attendanceRoutes = require('./routes/attendance.route.js');
const leaveRoutes = require('./routes/leave.route.js');
const efficiencyRoutes = require('./routes/efficiency.route.js');  // Efficiency routes
const appraisalRoutes = require('./routes/appraisal.route.js');  // Import appraisal routes
const messageRoutes = require('./routes/messenger.route.js');  // Import messenger routes
const teamRoutes = require('./routes/team.route.js');  // Import team management routes
const employeeRoutes = require('./routes/employee.route.js');  // Import employee management routes
const authRoutes = require('./routes/auth.route.js');  // Auth routes for login and registration



const app = express();

// Middleware
app.use(bodyParser.json());  // Parses incoming JSON requests
app.use('/api/attendance', attendanceRoutes);  // Mount the attendance routes on /api
app.use('/api/leave', leaveRoutes);  // Mount the leave routes
app.use('/api/efficiency', efficiencyRoutes);  // Mount the efficiency routes
app.use('/api/appraisal', appraisalRoutes);  // Mount the appraisal routes
app.use('/api/message', messageRoutes);  // Mount the messenger routes
app.use('/api/team', teamRoutes);  // Mount the team routes
app.use('/api/employee', employeeRoutes);  // Mount the team routes
app.use('/api/auth', authRoutes);  // Register login routes

// Create server and socket.io instance
const server = http.createServer(app);

// Set up Socket.io on the server
const io = socketIo(server, {
  cors: {
    origin: "*", // Change this to allow requests only from your frontend origin (for production)
    methods: ["GET", "POST"]
  }
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Get the unique socket ID
  console.log('Socket ID:', socket.id);

  socket.on('sendMessage', (messageData) => {
    console.log('Message received: ', messageData);
    
    // Emit the message to the receiver
    socket.to(messageData.receiverId).emit('newMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


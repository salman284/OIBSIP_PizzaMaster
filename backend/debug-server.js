const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.json({ message: 'Server is working!' });
});

app.get('/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'Test successful!' });
});

// MongoDB connection (optional for basic testing)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
      console.error('❌ MongoDB connection error:', error.message);
      // Don't exit, continue without MongoDB
    });
}

const PORT = process.env.PORT || 5002;

const server = app.listen(PORT, () => {
  console.log(`🚀 Debug server running on port ${PORT}`);
  console.log(`📊 Test at: http://localhost:${PORT}/test`);
});

// Error handling
server.on('error', (err) => {
  console.error('❌ Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

console.log('Debug server script loaded successfully');

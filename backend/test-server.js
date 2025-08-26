const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Server is working' });
});

// Test auth routes without MongoDB dependency
app.post('/api/auth/test', (req, res) => {
  console.log('Auth test endpoint hit');
  res.json({ 
    message: 'Auth routes are accessible',
    body: req.body 
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}/test`);
});

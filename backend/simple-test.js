const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  console.log('Request received!');
  res.send('Hello World!');
});

const PORT = 5002;
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`Simple server running on http://127.0.0.1:${PORT}/test`);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

console.log('Starting PizzaMaster Backend...');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

console.log('Basic middleware loaded...');

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pizzamaster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  // Don't exit on MongoDB connection error for now
});

console.log('MongoDB connection attempt made...');

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'PizzaMaster API is running!',
    version: '1.0.0',
    environment: process.env.NODE_ENV
  });
});

console.log('Basic route set up...');

// Import and use routes
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('Auth routes loaded');
} catch (error) {
  console.error('Error loading auth routes:', error.message);
}

try {
  const pizzaBaseRoutes = require('./routes/pizzaBases');
  app.use('/api/pizza-bases', pizzaBaseRoutes);
  console.log('Pizza base routes loaded');
} catch (error) {
  console.error('Error loading pizza base routes:', error.message);
}

try {
  const sauceRoutes = require('./routes/sauces');
  app.use('/api/sauces', sauceRoutes);
  console.log('Sauce routes loaded');
} catch (error) {
  console.error('Error loading sauce routes:', error.message);
}

try {
  const cheeseRoutes = require('./routes/cheeses');
  app.use('/api/cheeses', cheeseRoutes);
  console.log('Cheese routes loaded');
} catch (error) {
  console.error('Error loading cheese routes:', error.message);
}

try {
  const toppingRoutes = require('./routes/toppings');
  app.use('/api/toppings', toppingRoutes);
  console.log('Topping routes loaded');
} catch (error) {
  console.error('Error loading topping routes:', error.message);
}

try {
  const orderRoutes = require('./routes/orders');
  app.use('/api/orders', orderRoutes);
  console.log('Order routes loaded');
} catch (error) {
  console.error('Error loading order routes:', error.message);
}

try {
  const inventoryRoutes = require('./routes/inventory');
  app.use('/api/inventory', inventoryRoutes);
  console.log('Inventory routes loaded');
} catch (error) {
  console.error('Error loading inventory routes:', error.message);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Import error handling middleware
try {
  const { errorHandler } = require('./middleware/errorHandler');
  const { notFound } = require('./middleware/notFound');
  
  app.use(notFound);
  app.use(errorHandler);
  console.log('Error handling middleware loaded');
} catch (error) {
  console.error('Error loading middleware:', error.message);
}

const PORT = process.env.PORT || 5000;

console.log('Starting server...');

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📱 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`📊 API Documentation available at http://localhost:${PORT}/`);
});

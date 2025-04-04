const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://shashankb2004.github.io',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Handle preflight requests
app.options('*', cors());

// Set security headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Permissions-Policy', 'interest-cohort=()');
  next();
});

app.use(express.json());

// MongoDB Connection
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('✅ MongoDB Connection Status: Connected');
  console.log('📊 Database Name:', mongoose.connection.name);
  console.log('🔌 Connection Host:', mongoose.connection.host);
  console.log('🔑 Connection Port:', mongoose.connection.port);
})
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('🔍 Error Details:', err);
  process.exit(1);
});

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EduBlog API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API URL: ${process.env.REACT_APP_API_URL}`);
}); 
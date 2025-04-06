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
  'https://educational-blog-1.onrender.com',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors());
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
const userRoutes = require('./routes/users');

app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/users', userRoutes);

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
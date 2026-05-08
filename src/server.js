const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config/env');
const database = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const workoutRoutes = require('./routes/workout.routes');
const communityRoutes = require('./routes/community.routes');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000'], credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Spark FitLife API', timestamp: new Date().toISOString() });
});

// Cloudinary config endpoint (for frontend unsigned uploads)
app.get('/api/cloudinary/config', (req, res) => {
  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/communities', communityRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  await database.connect(config.mongodbUri);
  app.listen(config.port, () => {
    console.log(`🚀  Spark FitLife API running on http://localhost:${config.port}`);
  });
};

startServer();

module.exports = app;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Import custom modules
const config = require('./config');
const logger = require('./utils/logger');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import middleware
const { requestLogger, errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const setupSwagger = require('./middleware/swagger');

// Request logging middleware
app.use(requestLogger);

// Connect to MongoDB
mongoose.connect(config.mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => logger.info('✅ MongoDB Connected'))
  .catch((err) => {
    logger.error('❌ MongoDB Connection Error:', err);
    process.exit(1); // Exit process with failure
  });

// Routes
const recommendRoute = require('./routes/recommend');
const productRoutes = require('./routes/products');

// API routes
app.use('/api/recommend', recommendRoute);
app.use('/api/products', productRoutes);

// API documentation route (Swagger)
setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: config.environment });
});

// Handle 404 errors
app.use(notFoundHandler);

// Error handling middleware (must be after all routes)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${config.environment} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Promise Rejection:', err);
  // Don't crash the server in production
  if (config.environment === 'development') {
    process.exit(1);
  }
});

module.exports = app; // Export for testing

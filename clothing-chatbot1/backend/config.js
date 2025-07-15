/**
 * Application configuration
 * Centralizes all environment variables with sensible defaults
 */

module.exports = {
  // Database configuration
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/clothing-db',
  
  // Server configuration
  port: parseInt(process.env.PORT) || 5000,
  environment: process.env.NODE_ENV || 'development',
  
  // Query configuration
  queryLimit: parseInt(process.env.QUERY_LIMIT) || 10,
  
  // Logging configuration
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // API configuration
  apiVersion: process.env.API_VERSION || 'v1',
  
  // Feature flags
  enableCaching: process.env.ENABLE_CACHING === 'true' || false,
  cacheExpiration: parseInt(process.env.CACHE_EXPIRATION) || 300 // 5 minutes in seconds
};
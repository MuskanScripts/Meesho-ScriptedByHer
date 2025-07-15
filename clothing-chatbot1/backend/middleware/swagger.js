const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const logger = require('../utils/logger');

/**
 * Configure and set up Swagger documentation middleware
 * @param {Express} app - Express application instance
 */
function setupSwagger(app) {
  try {
    // Serve swagger documentation at /api-docs
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      }
    }));
    
    logger.info('Swagger documentation initialized at /api-docs');
  } catch (error) {
    logger.error('Failed to initialize Swagger documentation:', error);
  }
}

module.exports = setupSwagger;
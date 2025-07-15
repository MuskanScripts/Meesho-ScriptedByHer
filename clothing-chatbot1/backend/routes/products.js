/**
 * Product routes
 * Handles all product-related API endpoints
 */

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Search products
router.post('/search', productController.searchProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Get distinct values for a field
router.get('/distinct/:field', productController.getDistinctValues);

module.exports = router;
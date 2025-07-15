/**
 * Script to generate sample clothing data for testing
 * Run with: node scripts/generateSampleData.js
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import config and models
const config = require('../config');
const Product = require('../models/Product');

// Sample data
const sampleProducts = [
  {
    id: 10001,
    gender: 'Men',
    masterCategory: 'Apparel',
    subCategory: 'Topwear',
    articleType: 'Shirts',
    baseColour: 'Navy Blue',
    season: 'Summer',
    usage: 'Casual',
    productDisplayName: 'Turtle Check Men Navy Blue Shirt',
    link: 'http://example.com/product/10001'
  },
  {
    id: 10002,
    gender: 'Men',
    masterCategory: 'Apparel',
    subCategory: 'Topwear',
    articleType: 'Tshirts',
    baseColour: 'Blue',
    season: 'Summer',
    usage: 'Casual',
    productDisplayName: 'Fila Men\'s Round Neck Blue T-shirt',
    link: 'http://example.com/product/10002'
  },
  {
    id: 10003,
    gender: 'Women',
    masterCategory: 'Apparel',
    subCategory: 'Topwear',
    articleType: 'Shirts',
    baseColour: 'White',
    season: 'Summer',
    usage: 'Formal',
    productDisplayName: 'Arrow Women White Formal Shirt',
    link: 'http://example.com/product/10003'
  },
  {
    id: 10004,
    gender: 'Women',
    masterCategory: 'Accessories',
    subCategory: 'Watches',
    articleType: 'Watches',
    baseColour: 'Rose Gold',
    season: 'Winter',
    usage: 'Casual',
    productDisplayName: 'Fossil Women Rose Gold Watch',
    link: 'http://example.com/product/10004'
  },
  {
    id: 10005,
    gender: 'Men',
    masterCategory: 'Footwear',
    subCategory: 'Shoes',
    articleType: 'Sneakers',
    baseColour: 'White',
    season: 'Summer',
    usage: 'Sports',
    productDisplayName: 'Nike Men White Running Shoes',
    link: 'http://example.com/product/10005'
  },
  {
    id: 10006,
    gender: 'Women',
    masterCategory: 'Apparel',
    subCategory: 'Bottomwear',
    articleType: 'Jeans',
    baseColour: 'Blue',
    season: 'Winter',
    usage: 'Casual',
    productDisplayName: 'Levis Women Blue Skinny Fit Jeans',
    link: 'http://example.com/product/10006'
  },
  {
    id: 10007,
    gender: 'Men',
    masterCategory: 'Apparel',
    subCategory: 'Topwear',
    articleType: 'Sweatshirts',
    baseColour: 'Grey',
    season: 'Winter',
    usage: 'Casual',
    productDisplayName: 'H&M Men Grey Solid Sweatshirt',
    link: 'http://example.com/product/10007'
  },
  {
    id: 10008,
    gender: 'Women',
    masterCategory: 'Accessories',
    subCategory: 'Belts',
    articleType: 'Belts',
    baseColour: 'Black',
    season: 'Winter',
    usage: 'Formal',
    productDisplayName: 'Gucci Women Black Leather Belt',
    link: 'http://example.com/product/10008'
  },
  {
    id: 10009,
    gender: 'Men',
    masterCategory: 'Apparel',
    subCategory: 'Bottomwear',
    articleType: 'Trousers',
    baseColour: 'Beige',
    season: 'Summer',
    usage: 'Formal',
    productDisplayName: 'Arrow Men Beige Formal Trousers',
    link: 'http://example.com/product/10009'
  },
  {
    id: 10010,
    gender: 'Women',
    masterCategory: 'Apparel',
    subCategory: 'Topwear',
    articleType: 'Tshirts',
    baseColour: 'Pink',
    season: 'Summer',
    usage: 'Casual',
    productDisplayName: 'Puma Women Pink Sports T-shirt',
    link: 'http://example.com/product/10010'
  }
];

// Connect to MongoDB
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample data
    const result = await Product.insertMany(sampleProducts);
    console.log(`Added ${result.length} sample products to the database`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');

    console.log('Sample data generation completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
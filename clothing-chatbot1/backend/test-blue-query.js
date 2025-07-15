const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// Define the Product model
const Product = require('./models/Product');

// Test the specific query
async function testBlueQuery() {
  try {
    console.log('\n--- Testing User\'s Specific Query ---');
    
    // 1. Original query that didn't work
    const originalQuery = { baseColour: 'blue' };
    const originalResults = await Product.find(originalQuery).limit(10);
    console.log(`Original query (${JSON.stringify(originalQuery)}): Found ${originalResults.length} results`);
    
    // 2. Fixed query with case-insensitive search
    const fixedQuery = { baseColour: { $regex: 'blue', $options: 'i' } };
    const fixedResults = await Product.find(fixedQuery).limit(10);
    console.log(`\nFixed query (${JSON.stringify(fixedQuery)}): Found ${fixedResults.length} results`);
    console.log('Sample results:');
    console.log(fixedResults.slice(0, 5).map(p => ({ 
      id: p.id, 
      baseColour: p.baseColour, 
      name: p.productDisplayName 
    })));
    
    // 3. Check if the specific items mentioned by the user are found
    const userItems = [
      { id: 15970, baseColour: 'Navy Blue', name: 'Turtle Check Men Navy Blue Shirt' },
      { id: 39386, baseColour: 'Blue', name: 'Peter England Men Party Blue Jeans' }
    ];
    
    console.log('\nChecking for specific items mentioned by user:');
    for (const item of userItems) {
      const found = await Product.findOne({ id: item.id });
      if (found) {
        console.log(`✅ Found item: ${item.name} (ID: ${item.id}, Color: ${item.baseColour})`);
      } else {
        console.log(`❌ Item not found: ${item.name} (ID: ${item.id})`);
      }
    }
    
    console.log('\n✅ SOLUTION SUMMARY:');
    console.log('The issue was that MongoDB queries are case-sensitive by default.');
    console.log('We fixed this by modifying the recommend.js route to use case-insensitive regex searches.');
    console.log('Now queries for "blue" will match both "Blue" and "Navy Blue" items.');
    
  } catch (error) {
    console.error('Error testing query:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testBlueQuery();
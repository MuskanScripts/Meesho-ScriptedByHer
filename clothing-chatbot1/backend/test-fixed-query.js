const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// Define the Product model
const Product = require('./models/Product');

// Test the specific query
async function testFixedQuery() {
  try {
    console.log('\n--- Testing Fixed Query ---');
    
    // 1. Original query that didn't work
    const originalQuery = { baseColour: 'blue', type: 'shirt' };
    console.log(`Original query: ${JSON.stringify(originalQuery)}`);
    
    // 2. Apply field mappings (simulating what recommend.js now does)
    const mappedQuery = { ...originalQuery };
    const fieldMappings = {
      'type': 'articleType',
      'color': 'baseColour'
    };
    
    for (const [commonField, dbField] of Object.entries(fieldMappings)) {
      if (mappedQuery[commonField]) {
        mappedQuery[dbField] = mappedQuery[commonField];
        delete mappedQuery[commonField];
      }
    }
    
    console.log(`After field mapping: ${JSON.stringify(mappedQuery)}`);
    
    // 3. Apply case-insensitive search (simulating what recommend.js now does)
    const stringFields = ['baseColour', 'articleType'];
    for (const field of stringFields) {
      if (mappedQuery[field] && typeof mappedQuery[field] === 'string') {
        mappedQuery[field] = { $regex: mappedQuery[field], $options: 'i' };
      }
    }
    
    console.log(`Final query: ${JSON.stringify(mappedQuery)}`);
    
    // 4. Execute the query
    const results = await Product.find(mappedQuery).limit(5);
    console.log(`\nFound ${results.length} results`);
    
    if (results.length > 0) {
      console.log('Sample results:');
      console.log(results.map(p => ({ 
        id: p.id, 
        articleType: p.articleType,
        baseColour: p.baseColour,
        name: p.productDisplayName 
      })));
    }
    
    // 5. Check for specific items
    console.log('\nChecking for blue shirts specifically:');
    const blueShirts = await Product.find({
      baseColour: { $regex: 'blue', $options: 'i' },
      articleType: { $regex: 'shirt', $options: 'i' }
    }).limit(5);
    
    console.log(`Found ${blueShirts.length} blue shirts`);
    if (blueShirts.length > 0) {
      console.log(blueShirts.map(p => ({ 
        id: p.id, 
        articleType: p.articleType,
        baseColour: p.baseColour,
        name: p.productDisplayName 
      })));
    }
    
    // 6. List all unique articleType values
    const uniqueTypes = await Product.distinct('articleType');
    console.log('\nUnique articleType values in the database:');
    console.log(uniqueTypes);
    
    console.log('\n✅ SOLUTION SUMMARY:');
    console.log('1. Fixed the schema in Product.js to match the actual database structure');
    console.log('2. Updated recommend.js to map "type" to "articleType" in queries');
    console.log('3. Applied case-insensitive search for all string fields');
    
  } catch (error) {
    console.error('Error testing query:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testFixedQuery();
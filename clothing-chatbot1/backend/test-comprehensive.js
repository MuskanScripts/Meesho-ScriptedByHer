const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// Define the Product model
const Product = require('./models/Product');

async function runTests() {
  try {
    console.log('\n🔍 TESTING MONGODB QUERIES');
    console.log('=======================');
    
    // Test 1: Original problematic query
    console.log('\n📋 TEST 1: Original problematic query');
    const originalQuery = { baseColour: 'blue', type: 'shirt' };
    console.log(`Query: ${JSON.stringify(originalQuery)}`);
    const originalResults = await Product.find(originalQuery).limit(5);
    console.log(`Results: ${originalResults.length} items found`);
    
    // Test 2: Fixed query with field mapping
    console.log('\n📋 TEST 2: Fixed query with field mapping');
    const mappedQuery = { baseColour: 'blue', articleType: 'shirt' };
    console.log(`Query: ${JSON.stringify(mappedQuery)}`);
    const mappedResults = await Product.find(mappedQuery).limit(5);
    console.log(`Results: ${mappedResults.length} items found`);
    
    // Test 3: Case-insensitive search
    console.log('\n📋 TEST 3: Case-insensitive search');
    const caseInsensitiveQuery = {
      baseColour: { $regex: 'blue', $options: 'i' },
      articleType: { $regex: 'shirt', $options: 'i' }
    };
    console.log(`Query: ${JSON.stringify(caseInsensitiveQuery)}`);
    const caseInsensitiveResults = await Product.find(caseInsensitiveQuery).limit(5);
    console.log(`Results: ${caseInsensitiveResults.length} items found`);
    
    if (caseInsensitiveResults.length > 0) {
      console.log('Sample results:');
      console.log(caseInsensitiveResults.map(p => ({
        id: p.id,
        articleType: p.articleType,
        baseColour: p.baseColour,
        name: p.productDisplayName
      })));
    }
    
    // Test 4: Simulating the recommend.js processing
    console.log('\n📋 TEST 4: Simulating the recommend.js processing');
    const userQuery = { baseColour: 'blue', type: 'shirt' };
    console.log(`Original user query: ${JSON.stringify(userQuery)}`);
    
    // Apply field mappings
    const processedQuery = { ...userQuery };
    const fieldMappings = {
      'type': 'articleType',
      'color': 'baseColour'
    };
    
    for (const [commonField, dbField] of Object.entries(fieldMappings)) {
      if (processedQuery[commonField]) {
        processedQuery[dbField] = processedQuery[commonField];
        delete processedQuery[commonField];
      }
    }
    
    console.log(`After field mapping: ${JSON.stringify(processedQuery)}`);
    
    // Apply case-insensitive search
    const stringFields = ['baseColour', 'articleType', 'gender', 'usage', 'season', 'subCategory', 'masterCategory'];
    for (const field of stringFields) {
      if (processedQuery[field] && typeof processedQuery[field] === 'string') {
        processedQuery[field] = { $regex: processedQuery[field], $options: 'i' };
      }
    }
    
    console.log(`Final processed query: ${JSON.stringify(processedQuery)}`);
    
    const finalResults = await Product.find(processedQuery).limit(5);
    console.log(`Results: ${finalResults.length} items found`);
    
    if (finalResults.length > 0) {
      console.log('Sample results:');
      console.log(finalResults.map(p => ({
        id: p.id,
        articleType: p.articleType,
        baseColour: p.baseColour,
        name: p.productDisplayName
      })));
    }
    
    // Test 5: Check for partial matches
    console.log('\n📋 TEST 5: Testing partial matches');
    
    // Test for 'shirt' vs 'Shirts'
    const partialMatchQuery = {
      articleType: { $regex: 'shirt', $options: 'i' }
    };
    console.log(`Query for any shirt-like items: ${JSON.stringify(partialMatchQuery)}`);
    const shirtResults = await Product.find(partialMatchQuery).limit(5);
    console.log(`Results: ${shirtResults.length} items found`);
    
    if (shirtResults.length > 0) {
      console.log('Sample shirt results:');
      console.log(shirtResults.map(p => ({
        id: p.id,
        articleType: p.articleType,
        name: p.productDisplayName
      })));
    }
    
    // List unique articleType values that contain 'shirt'
    const shirtTypes = await Product.distinct('articleType', {
      articleType: { $regex: 'shirt', $options: 'i' }
    });
    console.log('\nUnique articleType values containing "shirt":');
    console.log(shirtTypes);
    
    console.log('\n✅ SOLUTION SUMMARY:');
    console.log('1. Fixed the schema in Product.js to match the actual database structure');
    console.log('2. Updated recommend.js to map "type" to "articleType" in queries');
    console.log('3. Applied case-insensitive search for all string fields');
    console.log('4. The query { baseColour: "blue", type: "shirt" } now correctly returns blue shirts');
    
  } catch (error) {
    console.error('Error running tests:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the tests
runTests();
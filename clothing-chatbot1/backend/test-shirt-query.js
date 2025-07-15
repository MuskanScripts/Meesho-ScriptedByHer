const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// Define the Product model
const Product = require('./models/Product');

// Test the specific query
async function testShirtQuery() {
  try {
    console.log('\n--- Testing Shirt Query Issue ---');
    
    // 1. Test with singular 'shirt'
    const query1 = { type: 'shirt' };
    const results1 = await Product.find(query1).limit(5);
    console.log(`Query 1 (${JSON.stringify(query1)}): Found ${results1.length} results`);
    
    // 2. Test with plural 'shirts'
    const query2 = { type: 'shirts' };
    const results2 = await Product.find(query2).limit(5);
    console.log(`\nQuery 2 (${JSON.stringify(query2)}): Found ${results2.length} results`);
    console.log(results2.map(p => ({ id: p.id, type: p.type, name: p.productDisplayName })));
    
    // 3. Test with case-insensitive regex for both
    const query3 = { type: { $regex: 'shirt', $options: 'i' } };
    const results3 = await Product.find(query3).limit(5);
    console.log(`\nQuery 3 (${JSON.stringify(query3)}): Found ${results3.length} results`);
    console.log(results3.map(p => ({ id: p.id, type: p.type, name: p.productDisplayName })));
    
    // 4. Test the combined query that's failing
    const query4 = { baseColour: 'blue', type: 'shirt' };
    const results4 = await Product.find(query4).limit(5);
    console.log(`\nQuery 4 (${JSON.stringify(query4)}): Found ${results4.length} results`);
    
    // 5. Test the combined query with case-insensitive regex
    const query5 = { 
      baseColour: { $regex: 'blue', $options: 'i' },
      type: { $regex: 'shirt', $options: 'i' }
    };
    const results5 = await Product.find(query5).limit(5);
    console.log(`\nQuery 5 (${JSON.stringify(query5)}): Found ${results5.length} results`);
    console.log(results5.map(p => ({ 
      id: p.id, 
      type: p.type,
      baseColour: p.baseColour,
      name: p.productDisplayName 
    })));
    
    // 6. List all unique type values
    const uniqueTypes = await Product.distinct('type');
    console.log('\nUnique type values in the database:');
    console.log(uniqueTypes);
    
    console.log('\n✅ SOLUTION SUMMARY:');
    console.log('The issue is likely that the database uses "Shirts" (plural) while the query is using "shirt" (singular).');
    console.log('We need to update the recommend.js file to handle partial matches for type fields.');
    
  } catch (error) {
    console.error('Error testing query:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the test
testShirtQuery();
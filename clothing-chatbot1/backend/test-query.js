const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// Define the Product model
const Product = require('./models/Product');

// Test different queries
async function testQueries() {
  try {
    console.log('\n--- Testing Queries ---');
    
    // 1. Test with lowercase 'blue'
    const query1 = { baseColour: 'blue' };
    const results1 = await Product.find(query1).limit(5);
    console.log(`Query 1 (${JSON.stringify(query1)}): Found ${results1.length} results`);
    console.log(results1.map(p => ({ id: p.id, baseColour: p.baseColour, name: p.productDisplayName })));
    
    // 2. Test with exact case 'Blue'
    const query2 = { baseColour: 'Blue' };
    const results2 = await Product.find(query2).limit(5);
    console.log(`\nQuery 2 (${JSON.stringify(query2)}): Found ${results2.length} results`);
    console.log(results2.map(p => ({ id: p.id, baseColour: p.baseColour, name: p.productDisplayName })));
    
    // 3. Test with case-insensitive regex
    const query3 = { baseColour: { $regex: 'blue', $options: 'i' } };
    const results3 = await Product.find(query3).limit(5);
    console.log(`\nQuery 3 (${JSON.stringify(query3)}): Found ${results3.length} results`);
    console.log(results3.map(p => ({ id: p.id, baseColour: p.baseColour, name: p.productDisplayName })));
    
    // 4. Test with 'Navy Blue'
    const query4 = { baseColour: 'Navy Blue' };
    const results4 = await Product.find(query4).limit(5);
    console.log(`\nQuery 4 (${JSON.stringify(query4)}): Found ${results4.length} results`);
    console.log(results4.map(p => ({ id: p.id, baseColour: p.baseColour, name: p.productDisplayName })));
    
    // 5. List all unique baseColour values
    const uniqueColors = await Product.distinct('baseColour');
    console.log('\nUnique baseColour values in the database:');
    console.log(uniqueColors);
    
    // 6. Count total documents
    const totalCount = await Product.countDocuments();
    console.log(`\nTotal documents in collection: ${totalCount}`);
    
  } catch (error) {
    console.error('Error testing queries:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the tests
testQueries();
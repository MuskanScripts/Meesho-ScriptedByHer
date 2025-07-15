const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err));

// Define the Product model
const Product = require('./models/Product');

// Function to insert your test data
async function insertTestData() {
  try {
    // Check if data already exists
    const existingCount = await Product.countDocuments();
    console.log(`Current document count: ${existingCount}`);
    
    // Your test data
    const testData = [
      { 
        id: 15970, 
        gender: "Men", 
        type: "Shirts", 
        subType: "Topwear", 
        baseColour: "Navy Blue", 
        season: "Fall", 
        usage: "Casual", 
        images: "http://assets.myntassets.com/v1/images/style/properties/7a5b82d1372a7a5c6de67ae7a314fd91_images.jpg", 
        productDisplayName: "Turtle Check Men Navy Blue Shirt" 
      }, 
      { 
        id: 39386, 
        gender: "Men", 
        type: "Jeans", 
        subType: "Bottomwear", 
        baseColour: "Blue", 
        season: "Summer", 
        usage: "Casual", 
        images: "http://assets.myntassets.com/v1/images/style/properties/4850873d0c417e6480a26059f83aac29_images.jpg", 
        productDisplayName: "Peter England Men Party Blue Jeans" 
      }
    ];
    
    // Insert if collection is empty or has very few documents
    if (existingCount < 5) {
      for (const item of testData) {
        // Check if this specific item already exists
        const exists = await Product.findOne({ id: item.id });
        if (!exists) {
          await Product.create(item);
          console.log(`Added item: ${item.productDisplayName}`);
        } else {
          console.log(`Item already exists: ${item.productDisplayName}`);
        }
      }
    } else {
      console.log('Database already has data, skipping insertion');
    }
    
    // Test the query that's failing
    console.log('\nTesting query with lowercase "blue":');
    const blueItems = await Product.find({ baseColour: 'blue' });
    console.log(`Found ${blueItems.length} items with exact match 'blue'`);
    
    console.log('\nTesting query with case-insensitive regex:');
    const regexItems = await Product.find({ baseColour: { $regex: 'blue', $options: 'i' } });
    console.log(`Found ${regexItems.length} items with regex /blue/i`);
    console.log(regexItems.map(item => ({ id: item.id, color: item.baseColour, name: item.productDisplayName })));
    
    // Suggest a fix for the recommend.js route
    console.log('\n✅ SOLUTION:');
    console.log('The issue is that MongoDB queries are case-sensitive by default.');
    console.log('To fix this in your recommend.js file, modify the mongoFilter object before using it:');
    console.log(`
if (mongoFilter.baseColour) {
  // Convert to case-insensitive regex search
  mongoFilter.baseColour = { $regex: mongoFilter.baseColour, $options: 'i' };
}
`);
    console.log('This will make color searches case-insensitive.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
insertTestData();
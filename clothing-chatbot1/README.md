# Clothing Recommendation Chatbot

A chatbot that recommends clothes using Qwen.ai + MongoDB + React.

## Features

- Natural language processing for understanding user queries
- Product search with multiple criteria (color, type, gender, etc.)
- Case-insensitive and partial matching for better search results
- RESTful API for product search and retrieval
- Pagination for large result sets
- Field mapping to handle common terminology variations
- Comprehensive error handling and logging
- Database indexing for improved performance

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **AI**: Qwen.ai for natural language processing
- **Logging**: Winston
- **Documentation**: Swagger/OpenAPI
- **Frontend**: React (if applicable)

## Project Structure

```
clothing-chatbot/
├── backend/
│   ├── config.js                    # Centralized configuration
│   ├── index.js                     # Main application entry point
│   ├── swagger.json                 # API documentation
│   ├── logs/                        # Application logs
│   ├── controllers/
│   │   └── productController.js     # Request handlers
│   ├── models/
│   │   └── Product.js               # MongoDB schema
│   ├── routes/
│   │   ├── products.js              # Product API routes
│   │   └── recommend.js             # Chatbot recommendation routes
│   ├── services/
│   │   └── productService.js        # Business logic
│   ├── utils/
│   │   ├── fieldMappings.js         # Field name mappings
│   │   ├── logger.js                # Logging configuration
│   │   └── validation.js            # Input validation
│   └── __tests__/                   # Unit tests
│       └── productService.test.js   # Tests for product service
└── frontend/                        # Frontend code (if applicable)
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Qwen.ai API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/clothing-chatbot.git
   cd clothing-chatbot
   ```

2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/clothing-chatbot
   NODE_ENV=development
   QWEN_API_KEY=your_qwen_api_key
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Documentation

The API is documented using Swagger/OpenAPI. Once the server is running, you can access the documentation at:

```
http://localhost:5000/api-docs
```

### Main Endpoints

- `POST /api/recommend` - Get product recommendations from chatbot
- `POST /api/products/search` - Search for products with various criteria
- `GET /api/products/:id` - Get a specific product by ID
- `GET /api/products/distinct/:field` - Get all distinct values for a field
- `GET /health` - Health check endpoint

## Testing

Run the test suite with:

```bash
cd backend
npm test
```

## Future Improvements

- Add caching for frequently accessed data
- Implement user authentication and personalized recommendations
- Add more sophisticated NLP capabilities
- Enhance the frontend interface
- Add image recognition for clothing items
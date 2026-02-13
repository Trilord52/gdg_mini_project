require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

// Import routes
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - API information
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to E-Commerce Backend API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      products: {
        getAll: 'GET /products',
        getById: 'GET /products/:id',
        create: 'POST /products',
        update: 'PUT /products/:id',
        delete: 'DELETE /products/:id',
        filters: '?category=, ?minPrice=, ?maxPrice=',
      },
      cart: {
        get: 'GET /cart',
        add: 'POST /cart',
        update: 'PUT /cart',
        remove: 'DELETE /cart/:productId',
      },
      orders: {
        create: 'POST /orders',
        getAll: 'GET /orders',
        getById: 'GET /orders/:id',
      },
    },
    documentation: 'See README.md for detailed API documentation',
    note: 'This is a REST API. Use Postman or similar tools to test endpoints.',
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

module.exports = app;

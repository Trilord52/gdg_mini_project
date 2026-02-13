# GDG mini project ecommerce Backend API

A RESTful API for managing products, shopping cart, and orders

## Features

- **Products Management**
CRUD operations for products with filtering capabilities
- **Shopping Cart**
Add, update, and remove items from cart
- **Order Processing**
Create orders from cart with stock validation
- **Data Validation**
Request and schema-level validation
- **Error Handling**
Error handling with proper HTTP status codes


## Use own
- MongoDB Atlas account

## Installation
1. Clone the repository:
```bash
git clone https://github.com/Trilord52/gdg_mini_project.git
cd gdg_mini_project
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
   - Create `.env`, use own `MONGODB_URI` for MongoDB Atlas connection string and make default port `PORT` : 3000

4. Start the server:
```bash
npm run dev
```
## API Endpoints
### Products
- `GET /products` - Get all products (To filter use `?category=`, `?minPrice=`, `?maxPrice=`)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create a new product
- `PUT /products/:id` - Update a product
- `DELETE /products/:id` - Delete a product

### Cart
- `GET /cart` - Get all cart items
- `POST /cart` - Add item to cart (body: `{ productId, quantity }`)
- `PUT /cart` - Update cart item (body: `{ productId, quantity }`)
- `DELETE /cart/:productId` - Remove item from cart

### Orders
- `POST /orders` - Create order from cart (optional body: `{ customer: { name, email, address } }`)
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID

### Health Check
- `GET /health` - Check server status

## Request/Response Examples

### Create Product
```json
POST /products
{
  "name": "Mukecha",
  "description": "Traditional coffee grinder lol",
  "price": 50,
  "stock": 3,
  "category": "House utensils",
  "imageUrl": "https://example.com/mukecha.jpg"
}
```

### Add to Cart
```json
POST /cart
{
  "productId": "507f1f77bcf86cd799439011",
  "quantity": 2
}
```

### Create Order
```json
POST /orders
{
  "customer": {
    "name": "Abe Kebe",
    "email": "AbeKebe@Mukecha.com",
    "address": "Konta"
  }
}
```

## Validation Rules
### Product
- `name`: Required, non-empty string
- `price`: Required, positive number
- `stock`: Required, non-negative number
### Cart
- `productId`: Required, valid MongoDB ObjectId
- `quantity`: Required, number >= 1, must not exceed product stock
## Error Responses
All errors are returned in JSON format:
Example:
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error messages"]
}
```

## Testing with Postman

1. Import `postman_collection.json` file to Postman
2. Set up environment variables in Postman
   - `base_url`: `http://localhost:3000`
3. Start the server and test endpoints


Made by: Tinbite Yonas

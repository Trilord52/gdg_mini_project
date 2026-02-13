const Order = require('../models/order.model');
const CartItem = require('../models/cartItem.model');
const Product = require('../models/product.model');
const { validateObjectId } = require('../utils/validation');

// Create order from cart
const createOrder = async (req, res, next) => {
  try {
    // Get all cart items
    const cartItems = await CartItem.find().populate('product');

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Validate stock and calculate total
    const orderItems = [];
    let total = 0;
    const errors = [];

    for (const cartItem of cartItems) {
      const product = cartItem.product;

      // Re-check stock availability (to avoid race conditions)
      if (product.stock < cartItem.quantity) {
        errors.push(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${cartItem.quantity}`);
        continue;
      }

      const itemTotal = product.price * cartItem.quantity;
      total += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: cartItem.quantity,
        priceAtPurchase: product.price,
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock validation failed',
        errors,
      });
    }

    // Get customer info from request body (optional for this project)
    const customer = {
      name: req.body.customer?.name?.trim() || 'Guest',
      email: req.body.customer?.email?.trim() || '',
      address: req.body.customer?.address?.trim() || '',
    };

    // Create order
    const order = await Order.create({
      items: orderItems,
      total,
      customer,
    });

    // Decrement product stocks
    for (const cartItem of cartItems) {
      await Product.findByIdAndUpdate(cartItem.product._id, {
        $inc: { stock: -cartItem.quantity },
      });
    }

    // Clear cart
    await CartItem.deleteMany({});

    const populatedOrder = await Order.findById(order._id).populate('items.product', 'name price imageUrl');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('items.product', 'name price imageUrl').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get single order by ID
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!validateObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format',
      });
    }

    const order = await Order.findById(id).populate('items.product', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
};

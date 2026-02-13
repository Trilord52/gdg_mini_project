const CartItem = require('../models/cartItem.model');
const Product = require('../models/product.model');
const { validateObjectId, validateCartBody } = require('../utils/validation');

// Get all cart items
const getCart = async (req, res, next) => {
  try {
    const cartItems = await CartItem.find().populate('product', 'name price imageUrl');

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems,
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
const addToCart = async (req, res, next) => {
  try {
    const validationErrors = validateCartBody(req.body);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      });
    }

    // Check if item already exists in cart
    const existingCartItem = await CartItem.findOne({ product: productId });

    if (existingCartItem) {
      // Update quantity if item exists
      const newQuantity = existingCartItem.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Available: ${product.stock}, Total requested: ${newQuantity}`,
        });
      }

      existingCartItem.quantity = newQuantity;
      await existingCartItem.save();

      return res.status(200).json({
        success: true,
        message: 'Cart item updated',
        data: await CartItem.findById(existingCartItem._id).populate('product', 'name price imageUrl'),
      });
    }

    // Create new cart item
    const cartItem = await CartItem.create({
      product: productId,
      quantity,
    });

    const populatedCartItem = await CartItem.findById(cartItem._id).populate('product', 'name price imageUrl');

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: populatedCartItem,
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item
const updateCart = async (req, res, next) => {
  try {
    const validationErrors = validateCartBody(req.body);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validationErrors,
      });
    }

    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check stock availability
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Available: ${product.stock}, Requested: ${quantity}`,
      });
    }

    // Find and update cart item
    const cartItem = await CartItem.findOneAndUpdate(
      { product: productId },
      { quantity },
      { new: true, runValidators: true }
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    const populatedCartItem = await CartItem.findById(cartItem._id).populate('product', 'name price imageUrl');

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: populatedCartItem,
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!validateObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const cartItem = await CartItem.findOneAndDelete({ product: productId });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
};

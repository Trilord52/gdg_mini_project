const mongoose = require('mongoose');

const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }
  return true;
};

const validateProductBody = (body) => {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push('Product name is required and must be a non-empty string');
  }

  if (body.price !== undefined) {
    if (typeof body.price !== 'number' || body.price <= 0) {
      errors.push('Price must be a positive number');
    }
  } else if (body.price === undefined && !body._id) {
    errors.push('Product price is required');
  }

  if (body.stock !== undefined) {
    if (typeof body.stock !== 'number' || body.stock < 0) {
      errors.push('Stock must be a non-negative number');
    }
  } else if (body.stock === undefined && !body._id) {
    errors.push('Product stock is required');
  }

  return errors;
};

const validateCartBody = (body) => {
  const errors = [];

  if (!body.productId) {
    errors.push('productId is required');
  } else if (!validateObjectId(body.productId)) {
    errors.push('Invalid productId format');
  }

  if (body.quantity === undefined) {
    errors.push('quantity is required');
  } else if (typeof body.quantity !== 'number' || body.quantity < 1) {
    errors.push('quantity must be a number greater than or equal to 1');
  }

  return errors;
};

module.exports = {
  validateObjectId,
  validateProductBody,
  validateCartBody,
};

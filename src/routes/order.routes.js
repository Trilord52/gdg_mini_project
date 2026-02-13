const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getOrderById } = require('../controllers/order.controller');

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);

module.exports = router;

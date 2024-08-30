const express = require('express');
const mongoose = require('mongoose');

const { createOrder, getOrders } = require('../controllers/orderController');

const router = express.Router();

// Create Order Route
router.post('/create', createOrder);

// Get Orders by Query Route
router.get('/', getOrders);

module.exports = router;

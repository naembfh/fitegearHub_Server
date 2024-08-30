const express = require('express');
const { signup, login, refreshToken } = require('../controllers/authController');

const router = express.Router();

// Sign Up Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);

// Refresh Token Route
router.post('/refresh', refreshToken);

module.exports = router;

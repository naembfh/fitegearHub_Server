const express = require('express');
const productRoutes = require('../src/routes/productRoutes');
const authRoutes = require('../src/routes/authRoutes');
const orderRoutes = require('../src/routes/orderRoutes');
const cors = require('cors');
require('dotenv').config();

// Create an Express application
const app = express();

// Middleware

const corsOptions = {
    origin: ['https://playful-daffodil-a6b330.netlify.app', 'http://localhost:5000'], // Allow multiple origins
    credentials: true, // Allow credentials
};

app.use(cors(corsOptions));
app.use(express.json()); 

// Routes
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders/', orderRoutes);

// Fallback route for unmatched routes
app.use('*', (req, res) => {
    res.status(404).send('Not Found');
});

module.exports = app;

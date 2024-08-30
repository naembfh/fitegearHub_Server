const express = require('express');
const { 
    getAllProducts, 
    addProduct, 
    getProductById, 
    deleteProduct, 
    updateProduct 
} = require('../controllers/productController');

const router = express.Router();

// Route to get all products
router.get('/products', getAllProducts);

// Route to get a product by ID
router.get('/products/:id', getProductById);

// Route to add a new product
router.post('/products', addProduct);

// Route to delete a product by ID
router.delete('/products/:id', deleteProduct);

// Route to update a product by ID
router.put('/products/:id', updateProduct);

module.exports = router;


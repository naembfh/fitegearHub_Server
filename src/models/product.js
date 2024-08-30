// src/models/product.js
const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true, 
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number, 
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    categoryImage: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    benefit: {
        type: String,
        required: true,
    },
    ratings: {
        type: Number,
        default: null 
    }
});

// Pre-save middleware to set the auto-incrementing id
productSchema.pre('save', async function (next) {
    const product = this;
    if (product.isNew) {
        try {
         
            const lastProduct = await Product.findOne().sort({ id: -1 });
           
            product.id = lastProduct ? lastProduct.id + 1 : 1;
            next();
        } catch (error) {
            next(error); 
        }
    } else {
        next();
    }
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;

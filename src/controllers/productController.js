const Product = require('../models/product');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found" });
        }

        res.json({
            message: "Products retrieved successfully",
            products: products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single product by ID
const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({ id: parseInt(id) });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product retrieved successfully",
            product: product
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new product
const addProduct = async (req, res) => {
    const { name, price, category, stock, description, imageUrl, categoryImage,benefit } = req.body;

    try {
        // Find the highest current product ID and increment it by one
        const lastProduct = await Product.findOne().sort({ id: -1 });

        const newId = lastProduct ? lastProduct.id + 1 : 1;

        // Create a new product with the incremented ID
        const newProduct = new Product({
            id: newId,
            name,
            price,
            category,
            stock,
            description,
            imageUrl,
            categoryImage,
            benefit
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Product added successfully!",
            product: savedProduct,
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: error.message });
    }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findOneAndDelete({ id: parseInt(id) });
       
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product deleted successfully",
            product: deletedProduct,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a product by ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

 

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { id: parseInt(id) },
            updateData,
            { new: true } 
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    addProduct,
    deleteProduct,
    updateProduct
};

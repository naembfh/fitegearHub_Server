const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product'); 
// Create Order Controller
const createOrder = async (req, res) => {
    const { name, email, phone, address, items, totalAmount, paymentMethod } = req.body;

    // Validate all required fields, including paymentMethod
    if (!name || !email || !phone || !address || !items || items.length === 0 || !totalAmount || !paymentMethod) {
        return res.status(400).json({ message: 'All fields are required, including payment method' });
    }

    // Format the items array
    const formattedItems = items.map(item => ({
        productId: item.productId, // assuming productId is a number
        quantity: item.quantity
    }));

    // Start a session for the transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create the order with formatted items
        const order = new Order({
            name,
            email,
            phone,
            address,
            items: formattedItems,
            totalAmount,
            paymentMethod
        });

        await order.save({ session });

        // Update product quantities using id as number
        for (const item of formattedItems) {
            await Product.findOneAndUpdate(
                { id: item.productId }, // use the 'id' field to find the product
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        // Rollback the transaction in case of error
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get Orders by Query
const getOrders = async (req, res) => {
    const { name, email, phone } = req.query; 
    let query = {};

    if (name) {
        query.name = { $regex: name, $options: 'i' }; 
    }

    if (email) {
        query.email = { $regex: email, $options: 'i' }; 
    }

    if (phone) {
        query.phone = { $regex: phone, $options: 'i' }; 
    }

    try {
        const orders = await Order.find(query);
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createOrder,
    getOrders
};

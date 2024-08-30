const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

// Load environment variables
require('dotenv').config();

const {
    JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN
} = process.env;

// Sign Up Controller
const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, name, email, password, role = 'user' } = req.body; 

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
        const user = new User({
            username,
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        const accessToken = jwt.sign({
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role 
        }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });

        const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login Controller
const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const accessToken = jwt.sign({
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role 
        }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });

        const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES_IN });

        res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Refresh Token Controller
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const newAccessToken = jwt.sign({
            id: user._id,
            username: user.username,
            name: user.name,
            email: user.email,
            role: user.role // Include role in the token
        }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES_IN });

        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error(error);
        res.status(403).json({ message: 'Invalid refresh token' });
    }
};

module.exports = {
    signup,
    login,
    refreshToken
};

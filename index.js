const mongoose = require('mongoose');
const express = require('express');

const app = express();
require('dotenv').config();

const port = process.env.PORT;
const mongoUri = process.env.MONGO_URI;

// Ensure PORT and MONGO_URI are set
if (!port || !mongoUri) {
    console.error('Missing PORT or MONGO_URI in environment variables');
    process.exit(1);
}

console.log(`Server running on port ${port}`);

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect(mongoUri)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.error('Failed to connect', err));

// Define the schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Name is mandatory
    email: { type: String, required: true }, // Email is mandatory
    age: { type: Number },                  // Age is optional
    password: { type: String, required: true } // Password is mandatory
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Endpoint to create a new user
app.post('/user', async (req, res) => {
    try {
        const { name, email, age, password } = req.body;

        const newUser = new User({ name, email, age, password });
        const savedUser = await newUser.save();

        // Respond if data is valid
        res.status(200).json({ message: "User saved successfully!", data: savedUser });
    } catch (err) {
        // Respond if there's a validation error
        res.status(400).json({ message: "Validation failed", error: err.message });
    }
});

// Endpoint to retrieve all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users
        res.status(200).json({ message: "Users retrieved successfully", data: users });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Start the server
app.listen(port, () => console.log(`Server running on port ${port}`));
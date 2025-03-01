const sequelize = require('../config/connectDB'); // Import Sequelize connection
const { QueryTypes } = require('sequelize');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // User Model Import Karein
require('dotenv').config();


const updateUserProfile = async (req, res) => {
    try {
        
        const userId = req.user.id; 

        const { user_name } = req.body; 

        if (!user_name) {
            return res.status(400).json({ message: "user_name is required" });
        }

        // ✅ User ka name update karein
        const [updatedRows] = await User.update({ user_name }, { where: { id: userId } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const updateUserFullName = async (req, res) => {
    try {
        
        const userId = req.user.id; 

        const { fullname } = req.body; 

        if (!fullname) {
            return res.status(400).json({ message: "fullname is required" });
        }

        // ✅ User ka name update karein
        const [updatedRows] = await User.update({ fullname }, { where: { id: userId } });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", fullname });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};





module.exports = { updateUserProfile,updateUserFullName};



const db = require("../config/connectDB");
const { User, Investment, Withdraw, Income } = require('../models');
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/authMiddleware');




        exports.getWithdrawHistory = async (req, res) => {
            try {
        const user = req.user;
        // console.log("Authenticated User:", user);

        if (!user || !user.id) {
            return res.status(400).json({ error: "User not authenticated" });
        }   
        const userId = user.id;
    
        const WithdrawHistory = await Withdraw.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']] // Order by created_at in descending order
        });


        res.json({ success: true, data: WithdrawHistory });
    } catch (error) {
        console.error("Error fetching investment history:", error.message, error.stack);
        res.status(500).json({ error: error.message });
    }
};




  



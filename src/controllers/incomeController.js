
const db = require("../config/connectDB");
const { User, Investment, Withdraw, Income } = require('../models');
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/authMiddleware');




exports.getUserIncome = async (req, res) => {
  try {
    // Ensure user authentication middleware is used
    const userId = req.user.id; // Assuming req.user is set after authentication


    if (!userId || !userId) {
      return res.status(200).json({ error: " User Id Not  found" });
  }
    console.log(`Fetching income for user ID: ${userId}`);

    const incomeData = await Income.findAll({
      where: {
        user_id: userId, // Filter by logged-in user's ID
      },
      order: [["id", "DESC"]], // Order by id in descending order
      raw: true, // Returns plain JSON data without extra Sequelize metadata
    });

    console.log("Fetched Income Data:", incomeData);

    return res.status(200).json({ success: true, data: incomeData });
  } catch (error) {
    console.error("Error fetching income data:", error.stack);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};


exports.getLevelIncome = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ Use correct field name
  
        if (!userId) {
            return res.status(400).json({ error: "User ID is missing from token" });
        }
  
        console.log("Fetching Level Income for User ID:", userId); // ✅ Debugging
  
        // Fetch Level Income from DB
        const [income] = await db.execute(
            "SELECT * FROM incomes WHERE user_id = ? AND remarks = 'Level Income'", 
            [userId]
        );
  
        console.log("Income Data:", income); // ✅ Debugging database result
  
        return res.status(200).json({ success: true, data: income });
    } catch (error) {
        console.error("Error fetching income:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
  };
  

  exports.getRoiIncome = async (req, res) => {
    try {
        const userId = req.user.userId; // ✅ Use correct field name
  
        if (!userId) {
            return res.status(400).json({ error: "User ID is missing from token" });
        }
  
        console.log("Fetching Roi Income for User ID:", userId); // ✅ Debugging
  
        // Fetch Level Income from DB
        const [income] = await db.execute(
            "SELECT * FROM incomes WHERE user_id = ? AND remarks = 'Roi Income'", 
            [userId]
        );
  
        console.log("Income Data:", income); // ✅ Debugging database result
  
        return res.status(200).json({ success: true, data: income });
    } catch (error) {
        console.error("Error fetching income:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
  };

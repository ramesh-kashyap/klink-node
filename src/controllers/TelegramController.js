const sequelize = require('../config/connectDB'); // Import Sequelize connection
const { QueryTypes } = require('sequelize');
const TelegramUser = require('../models/telegram');
let timeNow = Date.now();

const getUserByTelegramId = async (req, res) => {
    try {
        const { telegram_id } = req.body;

        if (!telegram_id) {
            return res.status(400).json({
                message: "Telegram ID is required",
                status: false,
                timeStamp: timeNow,
            });
        }

        const query = `
            SELECT 
                tu.telegram_id, tu.tusername, tu.tname, tu.tlastname,
                u.id AS user_id, u.email, u.name, u.username
            FROM telegram_users tu
            LEFT JOIN users u ON tu.id = u.telegram_id
            WHERE tu.telegram_id = :telegram_id;
        `;
        // Use Sequelize `query()` instead of `mysql.execute()`
        const results = await sequelize.query(query, {
            replacements: { telegram_id },  // Use replacements for security
            type: QueryTypes.SELECT         // Ensures correct result format
        });

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found",
                status: false,
                timeStamp: timeNow,
            });
        }

        return res.status(200).json({
            user: results[0],
            status: true,
            timeStamp: timeNow
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            status: false,
            timeStamp: timeNow,
        });
    }
};

const updateBalance = async (req, res) => {
    try {
        const { balance } = req.body;
        console.log("🔹 Requested Balance:", balance);

        const userId = req.user?.id; // Ensure req.user is not undefined
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const user = await TelegramUser.findOne({ where: { id: userId } });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newBalance = (user.balance || 0) + 1;

        // ✅ Use `update()` instead of `increment()`
        await TelegramUser.update({ balance: newBalance }, { where: { id: userId } });

        return res.status(200).json({
            message: "Balance updated successfully",
            balance: user.balance,
        });

    } catch (error) {
        console.error("❌ Error updating balance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { getUserByTelegramId, updateBalance};
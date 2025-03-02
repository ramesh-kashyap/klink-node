const sequelize = require('../config/connectDB'); // Import Sequelize connection
const { QueryTypes } = require('sequelize');
const TelegramUser = require('../models/telegram');
const Task = require("../models/Task");
const { UserTask } = require("../models"); // Import both models

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


const startTask = async (req, res) => {
    try {
        const { telegram_id, task_id } = req.body;

      
        const [userTask, created] = await UserTask.findOrCreate({
            where: { telegram_id, task_id },
            defaults: { status: "pending" },
          });
          res.json({ message: created ? "Task started" : "Task already in progress" });

    } catch (error) {
        res.status(500).json({ error: "Error starting task" });
    }
  };


  const claimTask = async (req, res) => {
    try {
        const { telegram_id, task_id } = req.body;

        await UserTask.update({ status: "completed" }, { where: { telegram_id, task_id } });

        res.json({ message: "Task claimed successfully" });

    } catch (error) {
        res.status(500).json({ error: "Error starting task" });
    }
  };

const getTasks = async (req, res) => {
    try {
        const { telegram_id } = req.body;        
        const tasks = await Task.findAll({
            include: [
              {
                model: UserTask,
                as: "userTasks",
                where: { telegram_id },
                required: false,
              },
            ],
          });
      
          // Format response to include status
          const formattedTasks = tasks.map((task) => ({
            id: task.id,
            name: task.name,
            reward: task.reward,
            icon: task.icon,
            status: task.userTasks?.length ? task.userTasks[0].status : "not_started",
          }));
      
          res.json(formattedTasks);

    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  

module.exports = { getUserByTelegramId,getTasks,startTask,claimTask,updateBalance };

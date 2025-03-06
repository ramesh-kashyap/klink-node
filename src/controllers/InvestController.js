const { Op } = require("sequelize");
const Transaction = require("../models/Transaction");

exports.getHistory = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query; // Pagination parameters

        const offset = (page - 1) * limit; // Calculate offset

        let whereCondition = {}; // Removed user-based filtering

        if (search) {
            whereCondition = {
                [Op.or]: [
                    { remark: { [Op.like]: `%${search}%` } },
                    { amount: { [Op.like]: `%${search}%` } },
                    { created_at: { [Op.like]: `%${search}%` } },
                    { user_id_fk: { [Op.like]: `%${search}%` } },
                ]
            };
        }

        const { count, rows } = await Transaction.findAndCountAll({
            where: whereCondition,
            order: [['created_at', 'DESC']],
            limit: parseInt(limit), 
            offset: parseInt(offset),
        });

        res.json({
            success: true,
            data: rows,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error("Error fetching transaction history:", error.message, error.stack);
        res.status(500).json({ error: error.message });
    }
};

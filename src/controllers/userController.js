const { User, Investment, Withdraw, Income } = require('../models');
const { Op } = require('sequelize');
const userIncomes = async (req, res)=>{
    try {
        const userId = req.user.id; 
        if (!userId) {
            console.log("User ID is missing from token");
            return res.status(400).json({ error: "User ID is missing from token" });
        }
        const totalInvestmentAmount = await Investment.sum('amount', {
            where: {
              id: userId,          // Fetch records where id matches userId
              roiCandition: 0       // Filter by roicandtion = 0
            }
          });
          const totalRoiAmount = await Income.sum('comm', {
            where: {
              id: userId,          // Fetch records where id matches userId
               // Filter by roicandtion = 0
            }
          });
          const totalTeamAmount = await Income.sum('comm', {
            where: {
              id: userId,          // Fetch records where id matches userId
              remarks: { 
                [Op.or]: ['Level Income', 'Direct Income']  // Filter by 'Level Income' OR 'Direct Income'
              }
            }
          });
        const totalWithdrawlAmount = await Withdraw.sum('amount',{
          where: { id: userId } // Fetch all users with id = 12 (typically returns 1)
        });
        
        res.json({
          status: true,
          data: {
            totalInvestmentAmount,
            totalRoiAmount,
            totalTeamAmount,
            totalWithdrawlAmount
          },
          
          message: 'Data Fetch Successfully'
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({
          status: false,
          data: null,
          message: 'Error fetching news'
        });
      }
}
module.exports = { userIncomes };
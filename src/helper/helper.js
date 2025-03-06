// services/balanceService.js
const { Income, Investment, Withdraw } = require("../models");
async function calculateAvailableBalance(userId) {
    // Assume Income, Investment, and Withdraw are imported models
    const [totalIncome, totalInvestment, totalWithdraw] = await Promise.all([
      Income.sum("comm", { where: { user_id: userId } }).then(sum => sum || 0),
      Investment.sum("amount", { where: { user_id: userId } }).then(sum => sum || 0),
      Withdraw.sum("amount", { where: { user_id: userId } }).then(sum => sum || 0)
    ]);
  
    const availableBalance = totalIncome - totalWithdraw;
    return {
      available_balance: availableBalance,
      total_withdrawn: totalWithdraw,
      total_investment: totalInvestment
    };
  }
  
  module.exports = { calculateAvailableBalance };
  
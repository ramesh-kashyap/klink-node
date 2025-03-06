const { User, Investment, Withdraw, Income } = require('../models');
const { Op } = require('sequelize');
const jwt = require("jsonwebtoken");
const authMiddleware = require('../middleware/authMiddleware');



const getUsersByIds = async (ids) => {
    return ids.length ? await User.findAll({ where: { id: { [Op.in]: ids } }, order: [['id', 'DESC']] }) : [];
};

const getTeamStats = async (team) => {
    if (team.length === 0) return { recharge: 0, withdraw: 0, earning: 0 };
    
    const usernames = team.map(user => user.username);

    const [recharge, withdraw, earning] = await Promise.all([
        Investment.sum('amount', { where: { user_id_fk: { [Op.in]: usernames }, status: 'Active' } }),
        Withdraw.sum('amount', { where: { user_id_fk: { [Op.in]: usernames }, status: 'Approved' } }),
        Income.sum('comm', { where: { user_id_fk: { [Op.in]: usernames } } })
    ]);

    return { recharge, withdraw, earning };
};

const myLevelTeam = async (userId, level = 3) => {
    let arrin = [userId];
    let ret = {};
    let i = 1;
    
    while (arrin.length > 0) {
        const allDown = await User.findAll({
            attributes: ['id'],
            where: { sponsor: { [Op.in]: arrin } }
        });

        if (allDown.length > 0) {
            arrin = allDown.map(user => user.id);
            ret[i] = arrin;
            i++;
            if (i > level) break;
        } else {
            arrin = [];
        }
    }
    return Object.values(ret).flat();
};

const myLevelTeamCount2 = async (userId, level = 3) => {
    let arrin = [userId];
    let ret = {};
    let i = 1;
    
    while (arrin.length > 0) {
        const allDown = await User.findAll({
            attributes: ['id'],
            where: { sponsor: { [Op.in]: arrin } }
        });

        if (allDown.length > 0) {
            arrin = allDown.map(user => user.id);
            ret[i] = arrin;
            i++;
            if (i > level) break;
        } else {
            arrin = [];
        }
    }
    return ret;
};



// const getTeam = async (req, res) => {
//     try {
//         const userId = req.user.id;
         
        

//         if (!userId || !userId) {
//             return res.status(200).json({ error: "Unauthorized: User not found" });
//         }
//         const ids = await myLevelTeam(userId);
//         const myLevelTeamCount = await myLevelTeamCount2(userId);
        
//         const genTeam1 = myLevelTeamCount[1] || [];
//         const genTeam2 = myLevelTeamCount[2] || [];
//         const genTeam3 = myLevelTeamCount[3] || [];
//         const genTeam4 = myLevelTeamCount[4] || [];
//         const genTeam5 = myLevelTeamCount[5] || [];
//         const genTeam6 = myLevelTeamCount[6] || [];


//         const notes = await User.findAll({
//             where: { id: ids.length ? { [Op.in]: ids } : null },
//             order: [['id', 'DESC']]
//         });

//         const [team1, team2, team3,team4,team5,team6] = await Promise.all([
//             getUsersByIds(genTeam1),
//             getUsersByIds(genTeam2),
//             getUsersByIds(genTeam3),
//             getUsersByIds(genTeam4),
//             getUsersByIds(genTeam5),
//             getUsersByIds(genTeam6)

//         ]);

//         const [team1Stats, team2Stats, team3Stats,team4Stats,team5Stats,team6Stats] = await Promise.all([
//             getTeamStats(team1),
//             getTeamStats(team2),
//             getTeamStats(team3),
//             getTeamStats(team4),
//             getTeamStats(team5),
//             getTeamStats(team6)

//         ]);

//         const response = {
//             gen_team1Recharge: team1Stats.recharge,
//             gen_team1Withdraw: team1Stats.withdraw,
//             gen_team1Earning: team1Stats.earning,
//             gen_team2Recharge: team2Stats.recharge,
//             gen_team2Withdraw: team2Stats.withdraw,
//             gen_team2Earning: team2Stats.earning,
//             gen_team3Recharge: team3Stats.recharge,
//             gen_team3Withdraw: team3Stats.withdraw,
//             gen_team3Earning: team3Stats.earning,
//             gen_team3Recharge: team4Stats.recharge,
//             gen_team3Withdraw: team4Stats.withdraw,
//             gen_team3Earning: team4Stats.earning,
//             gen_team3Recharge: team5Stats.recharge,
//             gen_team3Withdraw: team5Stats.withdraw,
//             gen_team3Earning: team5Stats.earning,
//             gen_team3Recharge: team6Stats.recharge,
//             gen_team3Withdraw: team6Stats.withdraw,
//             gen_team3Earning: team6Stats.earning,
//             gen_team1total: team1.length,
//             active_gen_team1total: team1.filter(u => u.active_status === 'Active').length,
//             gen_team2total: team2.length,
//             active_gen_team2total: team2.filter(u => u.active_status === 'Active').length,
//             gen_team3total: team3.length,
//             active_gen_team2total: team3.filter(u => u.active_status === 'Active').length,
//             gen_team3total: team4.length,
//             active_gen_team2total: team5.filter(u => u.active_status === 'Active').length,
//             gen_team3total: team6.length,
//             active_gen_team6total: team6.filter(u => u.active_status === 'Active').length,
//             todaysUser: notes.filter(u => u.jdate === new Date().toISOString().split('T')[0]).length,
//             totalTeam: notes.length,
//             ActivetotalTeam: notes.filter(u => u.active_status === 'Active').length,
//             totalLevelIncome: await Income.sum('comm', { where: { user_id: userId, remarks: 'Team Commission' } }),
//             balance: parseFloat(0)
//         };
//          res.status(200).json({
//             message: 'Fetch successfully',
//             status: true,
//             data: response
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(200).json({
//             message: 'Server error',
//             status: false,
//         });
//     }
// };

const LEVEL_PERCENTAGES = {
  1: 20,
  2: 10,
  3: 5,
  4: 3,
  5: 2,
  // Levels 6–10: 1%
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  10: 1,
  // Levels 11–20: 0.5%
  11: 0.5,
  12: 0.5,
  13: 0.5,
  14: 0.5,
  15: 0.5,
  16: 0.5,
  17: 0.5,
  18: 0.5,
  19: 0.5,
  20: 0.5,
  // Levels 21–30: 0.25%
  21: 0.25,
  22: 0.25,
  23: 0.25,
  24: 0.25,
  25: 0.25,
  26: 0.25,
  27: 0.25,
  28: 0.25,
  29: 0.25,
  30: 0.25,
};



const distributeCommissions = async (req, res) => {
  const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ success: false, message: "userId and amount are required" });
    }
  let currentUser = await User.findByPk(userId);
  let level = 1;

  while (currentUser && currentUser.sponsor && level <= 30) {
    const referrer = await User.findByPk(currentUser.sponsor);

    if (!referrer) break;

    // Fetch the correct percentage from LEVEL_PERCENTAGES or default to 0
    const percentage = LEVEL_PERCENTAGES[level] || 0;
    const commission = (amount * percentage) / 100;

    if (commission > 0) {
      
      await referrer.update({
        earnings: referrer.earnings + commission,
      });

     
      await Income.create({
        user_id: referrer.id,
        user_id_fk: currentUser.id,
        amt: amount,
        comm: commission,
        remarks: "Level Income",
        level,
        ttime: new Date(),
        type: "commission"
      });

      console.log(
        `Level ${level}: User ${referrer.id} earned ${commission.toFixed(2)}`
      );
    }

    currentUser = referrer;
    level++;
  }
};


  



const getReferralLevels = async (userId, level = 1, result = []) => {
    if (level > 30) return result; // Stop at level 30
  
    // Find all users referred by the current user
    const referrals = await User.findAll({
      where: { sponsor: userId },
      attributes: ["id"],
      raw: true,
    });
  
    if (referrals.length === 0) return result; // No more referrals
  
    // Calculate total earnings from this level
    const totalIncome = referrals.reduce((sum, user) => sum + user.earnings, 0);
  
    // Store level details
    result.push({
      level,
      members: referrals.length,
      totalIncome: totalIncome,
    });
  
    // Recursively fetch the next level
    for (let user of referrals) {
      await getReferralLevels(user.id, level + 1, result);
    }
  
    return result;
  };
  
  // 🚀 Controller to return user details with 30-level referral income
  const fetchUserWithReferralIncome = async (req, res) => {
    const userId = req.user.id; 
  
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
  
    try {
      // Fetch user details
      const user = await User.findByPk(userId, {
        attributes: ["id", "fullname", "email"],
        raw: true,
      });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Fetch referral levels data
      const referralLevels = await getReferralLevels(userId);
  
      return res.json({
        user,
        referralLevels,
      });
    } catch (error) {
      console.error("Error fetching user income:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  





module.exports = { fetchUserWithReferralIncome,distributeCommissions};

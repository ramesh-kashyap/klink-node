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



const getTeam = async (req, res) => {
  try {
      const user = req.user; // 🔹 Get authenticated user
      const userId = user.id;


// console.log(userId);


      if (!userId) {
          return res.status(200).json({ error: "Unauthorized: User not found" });
      }
      const ids = await myLevelTeam(userId);
      const myLevelTeamCount = await myLevelTeamCount2(userId);
      
      const genTeam1 = myLevelTeamCount[1] || [];
      const genTeam2 = myLevelTeamCount[2] || [];
      const genTeam3 = myLevelTeamCount[3] || [];
      const genTeam4 = myLevelTeamCount[4] || [];
      const genTeam5 = myLevelTeamCount[5] || [];
      const genTeam6 = myLevelTeamCount[6] || [];
      const genTeam7 = myLevelTeamCount[7] || [];
      const genTeam8 = myLevelTeamCount[8] || [];
      const genTeam9 = myLevelTeamCount[9] || [];
      const genTeam10 = myLevelTeamCount[10] || [];
      const genTeam11 = myLevelTeamCount[11] || [];
      const genTeam12 = myLevelTeamCount[12] || [];
      const genTeam13 = myLevelTeamCount[13] || [];
      const genTeam14 = myLevelTeamCount[14] || [];
      const genTeam15 = myLevelTeamCount[15] || [];
      const genTeam16 = myLevelTeamCount[16] || [];
      const genTeam17 = myLevelTeamCount[17] || [];
      const genTeam18 = myLevelTeamCount[18] || [];
      const genTeam19 = myLevelTeamCount[19] || [];
      const genTeam20 = myLevelTeamCount[20] || [];
      const genTeam21 = myLevelTeamCount[21] || [];
      const genTeam22 = myLevelTeamCount[22] || [];
      const genTeam23 = myLevelTeamCount[23] || [];
      const genTeam24 = myLevelTeamCount[24] || [];
      const genTeam25 = myLevelTeamCount[25] || [];
      const genTeam26 = myLevelTeamCount[26] || [];
      const genTeam27 = myLevelTeamCount[27] || [];
      const genTeam28 = myLevelTeamCount[28] || [];
      const genTeam29 = myLevelTeamCount[29] || [];
      const genTeam30 = myLevelTeamCount[30] || [];

      const notes = await User.findAll({
          where: { id: ids.length ? { [Op.in]: ids } : null },
          order: [['id', 'DESC']]
      });

// console.log(notes);



      const [team1, team2, team3, team4, team5, team6, team7, team8, team9, team10,
          team11, team12, team13, team14, team15, team16, team17, team18, team19, team20,
          team21, team22, team23, team24, team25, team26, team27, team28, team29, team30] = await Promise.all([
          getUsersByIds(genTeam1), getUsersByIds(genTeam2), getUsersByIds(genTeam3), getUsersByIds(genTeam4), 
          getUsersByIds(genTeam5), getUsersByIds(genTeam6), getUsersByIds(genTeam7), getUsersByIds(genTeam8),
          getUsersByIds(genTeam9), getUsersByIds(genTeam10), getUsersByIds(genTeam11), getUsersByIds(genTeam12),
          getUsersByIds(genTeam13), getUsersByIds(genTeam14), getUsersByIds(genTeam15), getUsersByIds(genTeam16),
          getUsersByIds(genTeam17), getUsersByIds(genTeam18), getUsersByIds(genTeam19), getUsersByIds(genTeam20),
          getUsersByIds(genTeam21), getUsersByIds(genTeam22), getUsersByIds(genTeam23), getUsersByIds(genTeam24),
          getUsersByIds(genTeam25), getUsersByIds(genTeam26), getUsersByIds(genTeam27), getUsersByIds(genTeam28),
          getUsersByIds(genTeam29), getUsersByIds(genTeam30)
      ]);

      const [team1Stats, team2Stats, team3Stats, team4Stats, team5Stats, team6Stats, team7Stats, team8Stats, team9Stats, team10Stats,
          team11Stats, team12Stats, team13Stats, team14Stats, team15Stats, team16Stats, team17Stats, team18Stats, team19Stats, team20Stats,
          team21Stats, team22Stats, team23Stats, team24Stats, team25Stats, team26Stats, team27Stats, team28Stats, team29Stats, team30Stats] = await Promise.all([
          getTeamStats(team1), getTeamStats(team2), getTeamStats(team3), getTeamStats(team4), getTeamStats(team5),
          getTeamStats(team6), getTeamStats(team7), getTeamStats(team8), getTeamStats(team9), getTeamStats(team10),
          getTeamStats(team11), getTeamStats(team12), getTeamStats(team13), getTeamStats(team14), getTeamStats(team15),
          getTeamStats(team16), getTeamStats(team17), getTeamStats(team18), getTeamStats(team19), getTeamStats(team20),
          getTeamStats(team21), getTeamStats(team22), getTeamStats(team23), getTeamStats(team24), getTeamStats(team25),
          getTeamStats(team26), getTeamStats(team27), getTeamStats(team28), getTeamStats(team29), getTeamStats(team30)
      ]);

      const response = {};

      for (let i = 1; i <= 30; i++) {
          response[`gen_team${i}Recharge`] = eval(`team${i}Stats`).recharge;
          response[`gen_team${i}Withdraw`] = eval(`team${i}Stats`).withdraw;
          response[`gen_team${i}Earning`] = eval(`team${i}Stats`).earning;
          response[`gen_team${i}total`] = eval(`team${i}`).length;
          response[`active_gen_team${i}total`] = eval(`team${i}`).filter(u => u.active_status === 'Active').length;
      }

      response.todaysUser = notes.filter(u => u.jdate === new Date().toISOString().split('T')[0]).length;
      response.totalTeam = notes.length;
      response.ActivetotalTeam = notes.filter(u => u.active_status === 'Active').length;
      response.totalLevelIncome = await Income.sum('comm', { where: { user_id: userId, remarks: 'Team Commission' } });
      response.balance = parseFloat(0);

      res.status(200).json({
          message: 'Fetch successfully',
          status: true,
          data: response
      });

  } catch (error) {
      console.error(error);
      res.status(200).json({
          message: 'Server error',
          status: false,
      });
  }
};



const listUsers = async (req, res) => {
  try {
      const { selected_level, limit = 4, page = 1, search } = req.query;
      const user = req.user; 
      const myLevelTeam = await myLevelTeamCount2(user.id);

      let genTeam = {};
      if (selected_level > 0) {
          genTeam = myLevelTeam[selected_level] || [];
      } else {
          genTeam = myLevelTeam;
      }

      let whereCondition = { [Op.or]: [] };

      if (Object.keys(genTeam).length > 0) {
          Object.values(genTeam).forEach((value) => {
              if (Array.isArray(value)) {
                  whereCondition[Op.or].push({ id: { [Op.in]: value } });
              } else {
                  whereCondition[Op.or].push({ id: value });
              }
          });
      } else {
          whereCondition = { id: null };
      }

      if (search) {
          whereCondition[Op.or] = [
              { fullname: { [Op.like]: `%${search}%` } },
              { username: { [Op.like]: `%${search}%` } },
              { email: { [Op.like]: `%${search}%` } },
              { phone: { [Op.like]: `%${search}%` } },
              { jdate: { [Op.like]: `%${search}%` } },
              { package: { [Op.like]: `%${search}%` } },
              { active_status: { [Op.like]: `%${search}%` } },
          ];
      }

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows } = await User.findAndCountAll({
          where: whereCondition,
          order: [["id", "DESC"]],
          limit: parseInt(limit),
          offset: offset,
      });

      return res.status(200).json({
          direct_team: rows,
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          status: true,
      });
  } catch (error) {
      console.error("❌ Error fetching user list:", error);
      return res.status(500).json({ message: "Internal Server Error", status: false });
  }
};







module.exports = { getTeam ,listUsers};

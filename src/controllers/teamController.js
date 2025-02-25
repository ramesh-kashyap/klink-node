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
        const {token} = req.body;
        if (!token || typeof token !== "string") {
            return res.status(200).json({ error: "Unauthorized: Invalid token" });
        }

        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }
        const secretKey = process.env.JWT_SECRET || "default_secret_key"; // Use environment variable or fallback

        const decoded = jwt.verify(token, secretKey); // Verify token
        const userId = decoded.userId;

         
        

        if (!userId || !userId) {
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


        const notes = await User.findAll({
            where: { id: ids.length ? { [Op.in]: ids } : null },
            order: [['id', 'DESC']]
        });

        const [team1, team2, team3,team4,team5,team6] = await Promise.all([
            getUsersByIds(genTeam1),
            getUsersByIds(genTeam2),
            getUsersByIds(genTeam3),
            getUsersByIds(genTeam4),
            getUsersByIds(genTeam5),
            getUsersByIds(genTeam6)

        ]);

        const [team1Stats, team2Stats, team3Stats,team4Stats,team5Stats,team6Stats] = await Promise.all([
            getTeamStats(team1),
            getTeamStats(team2),
            getTeamStats(team3),
            getTeamStats(team4),
            getTeamStats(team5),
            getTeamStats(team6)

        ]);

        const response = {
            gen_team1Recharge: team1Stats.recharge,
            gen_team1Withdraw: team1Stats.withdraw,
            gen_team1Earning: team1Stats.earning,
            gen_team2Recharge: team2Stats.recharge,
            gen_team2Withdraw: team2Stats.withdraw,
            gen_team2Earning: team2Stats.earning,
            gen_team3Recharge: team3Stats.recharge,
            gen_team3Withdraw: team3Stats.withdraw,
            gen_team3Earning: team3Stats.earning,
            gen_team3Recharge: team4Stats.recharge,
            gen_team3Withdraw: team4Stats.withdraw,
            gen_team3Earning: team4Stats.earning,
            gen_team3Recharge: team5Stats.recharge,
            gen_team3Withdraw: team5Stats.withdraw,
            gen_team3Earning: team5Stats.earning,
            gen_team3Recharge: team6Stats.recharge,
            gen_team3Withdraw: team6Stats.withdraw,
            gen_team3Earning: team6Stats.earning,
            gen_team1total: team1.length,
            active_gen_team1total: team1.filter(u => u.active_status === 'Active').length,
            gen_team2total: team2.length,
            active_gen_team2total: team2.filter(u => u.active_status === 'Active').length,
            gen_team3total: team3.length,
            active_gen_team2total: team3.filter(u => u.active_status === 'Active').length,
            gen_team3total: team4.length,
            active_gen_team2total: team5.filter(u => u.active_status === 'Active').length,
            gen_team3total: team6.length,
            active_gen_team6total: team6.filter(u => u.active_status === 'Active').length,
            todaysUser: notes.filter(u => u.jdate === new Date().toISOString().split('T')[0]).length,
            totalTeam: notes.length,
            ActivetotalTeam: notes.filter(u => u.active_status === 'Active').length,
            totalLevelIncome: await Income.sum('comm', { where: { user_id: userId, remarks: 'Team Commission' } }),
            balance: parseFloat(0)
        };
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



const list = async (req, res) => {
    try {
        const {token} = req.body;
        if (!token || typeof token !== "string") {
            return res.status(200).json({ error: "Unauthorized: Invalid token" });
        }
          console.log(token);

        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }
        const secretKey = process.env.JWT_SECRET || "default_secret_key"; // Use environment variable or fallback

        const decoded = jwt.verify(token, secretKey); // Verify token
        const userId = decoded.userId;

        if (!userId || !userId) {
            return res.status(200).json({ error: "Unauthorized: User not found" });
        }
        // const user = req.user;
        const ids = await myLevelTeam(userId);

        let whereCondition = {};

        if (genTeam.length > 0) {
            whereCondition.id = { [Op.in]: genTeam };
        } else {
            whereCondition.id = null;
        }

        const notes = await User.findAll({
            where: whereCondition,
            order: [['id', 'DESC']]
        });

        return res.json({
            direct_team: notes
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};





module.exports = { getTeam ,list};

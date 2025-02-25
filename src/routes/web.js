const express = require('express');
let router = express.Router();
const AuthController = require("../controllers/AuthController");
const IncomeController = require("../controllers/incomeController");
const TelegramController = require("../controllers/TelegramController");
const InvestController = require("../controllers/InvestController");
const withdrawController = require("../controllers/withdrawController");



const authMiddleware = require("../middleware/authMiddleware"); // JWT Auth Middleware

const passport = require('passport');


const googleController = require('../controllers/googleController');
const teamController = require('../controllers/teamController');



router.post('/google', googleController.verifyGoogleToken);
router.post('/register', AuthController.register);
router.get("/user-income", authMiddleware, IncomeController.getUserIncome);
router.get("/level-income", authMiddleware, IncomeController.getLevelIncome);
router.get("/Roi-income", authMiddleware, IncomeController.getRoiIncome);
router.post("/team",teamController.getTeam);
router.post('/list', authMiddleware, teamController.list);
router.post('/login', AuthController.login);
router.get("/deposit-History", authMiddleware, InvestController.getHistory);
router.get("/withdraw-History", authMiddleware, withdrawController.getWithdrawHistory);
router.get("/user-details", authMiddleware, AuthController.getUserDetails);


// telegram api 
router.post('/telegram-login', AuthController.loginWithTelegram);
router.post('/telegram-user-detail', TelegramController.getUserByTelegramId);



// Mount the router on /api/auth so that /register becomes /api/auth/register
const initWebRouter = (app) => {
    app.use('/api/auth', router);
  };

module.exports = initWebRouter;

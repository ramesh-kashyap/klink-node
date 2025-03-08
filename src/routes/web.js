const express = require('express');
let router = express.Router();
const AuthController = require("../controllers/AuthController");
const IncomeController = require("../controllers/incomeController");
const TelegramController = require("../controllers/TelegramController");
const InvestController = require("../controllers/InvestController");
const withdrawController = require("../controllers/withdrawController");
const profileController = require("../controllers/profileController");

const userController = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware"); // JWT Auth Middleware
const  homeController= require('../controllers/homeController');
const passport = require('passport');

const googleController = require('../controllers/googleController');
const teamController = require('../controllers/teamController');



router.post('/google', googleController.verifyGoogleToken);
router.post('/register', AuthController.register);
router.post('/set-pin', AuthController.setPin);

router.get("/user-income", authMiddleware, IncomeController.getUserIncome);
router.get("/level-income", authMiddleware, IncomeController.getLevelIncome);
router.get("/Direct-income", authMiddleware, IncomeController.getDirectIncome);
router.get("/Direct-user", authMiddleware, IncomeController.getReferralUser);

// router.post("/team", authMiddleware ,teamController.getTeam);
router.get('/list', authMiddleware, teamController.listUsers);
// // router.post("/team", authMiddleware,teamController.getTeam);
// router.post('/list', authMiddleware, teamController.fetchUserWithReferralIncome);
// router.post('/team-income',  teamController.distributeCommissions);
router.post('/login', AuthController.login);
router.get("/deposit-History", authMiddleware, InvestController.getHistory);
router.get("/withdraw-History", authMiddleware, withdrawController.getWithdrawHistory);
router.post('/verify-pin',authMiddleware, AuthController.verifyPin);
router.get('/live-data',authMiddleware, homeController.getLiveData);
router.get('/news',authMiddleware, homeController.getAllNews);
router.get('/getBalance',authMiddleware, homeController.getAvailableBalance);
router.get('/getNotifications',authMiddleware, homeController.getNotifications);
router.post('/updatePin',authMiddleware, AuthController.updatePin);
router.get('/user-incomes',authMiddleware, userController.userIncomes);
router.put('/updateUsername', authMiddleware, profileController.updateUserProfile);
router.put('/updateFullName', authMiddleware, profileController.updateUserFullName);
router.post("/withdraw", authMiddleware, withdrawController.withdraw);
router.post("/verify-otp", authMiddleware, withdrawController.verifyOtp);
router.post("/generate-otp", authMiddleware, withdrawController.generateOtp);
// router.get('/balance',authMiddleware, userController.getAvailableBalance);




// telegram api 
router.post('/telegram-login', AuthController.loginWithTelegram);
router.post('/telegram-user-detail', TelegramController.getUserByTelegramId);




// Mount the router on /api/auth so that /register becomes /api/auth/register
const initWebRouter = (app) => {
    app.use('/api/auth', router);
  };

module.exports = initWebRouter;

const express = require('express');
let router = express.Router();
const AuthController = require("../controllers/AuthController");
const IncomeController = require("../controllers/incomeController");
const TelegramController = require("../controllers/TelegramController");
const InvestController = require("../controllers/InvestController");
const withdrawController = require("../controllers/withdrawController");
const profileController = require("../controllers/profileController");



const authMiddleware = require("../middleware/authMiddleware"); // JWT Auth Middleware
const  homeController= require('../controllers/homeController');
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
router.post('/verify-pin', AuthController.verifyPin);
router.get('/live-data',authMiddleware, homeController.getLiveData);
router.get('/news',authMiddleware, homeController.getAllNews);
router.get('/getBalance',authMiddleware, homeController.getAvailableBalance);
router.get('/getNotifications',authMiddleware, homeController.getNotifications);

router.put('/updateUsername', authMiddleware, profileController.updateUserProfile);
router.put('/updateFullName', authMiddleware, profileController.updateUserFullName);



// telegram api 
router.post('/telegram-login', AuthController.loginWithTelegram);
router.post('/telegram-user-detail', TelegramController.getUserByTelegramId);



// Mount the router on /api/auth so that /register becomes /api/auth/register
const initWebRouter = (app) => {
    app.use('/api/auth', router);
  };

module.exports = initWebRouter;

// const TelegramBot = require('node-telegram-bot-api');
// // require('dotenv').config();
// const handleReferral = require('../controllers/AuthController'); // Import controller

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

// bot.onText(/\/start (\d+)/, async (msg, match) => {
//     const chatId = msg.chat.id;
//     const referrerId = match[1];

//     console.log(`New user: ${chatId}, Referred by: ${referrerId}`);

//     await handleReferral(chatId, referrerId);
// });


// const TelegramBot = require('node-telegram-bot-api');
// const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true })
// bot.onText(/\/start (\d+)/, (msg, match) => {
//     const chatId = msg.chat.id; 
//     const referrerId = match[1]; 

//     console.log(chatId,referrerId);
// });

// module.exports = bot;

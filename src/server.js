require('dotenv').config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const winston = require("winston");
const session = require("express-session");
const passport = require("passport");
const axios = require("axios"); // For sending messages to Telegram
const initWebRouter = require("./routes/web");

const app = express();
const PORT = process.env.PORT || 5001;

// Security Middleware
app.use(helmet());
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: "http://localhost:3000", // Adjust as needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Logger Configuration
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston.transports.Console({ format: winston.format.simple() })
    ]
});

// Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Initialize Web Routes
initWebRouter(app);

// Default Route
app.get("/", (req, res) => {
    res.send({ message: "Secure Node.js API with MySQL" });
});

app.get("/register", (req, res) => {
    res.send({ message: "Hello, this is a test!" });
    console.log('"Hello, this is a test!"');
});

// **Telegram Webhook Route**
app.post("/webhook", async (req, res) => {
    const { message } = req.body;

    if (message) {
        const chatId = message.chat.id;
        const userText = message.text;

        console.log("Received Message:", userText);

        // Send a response message back to the user
        await sendMessage(chatId, `You said: ${userText}`);
    }

    res.sendStatus(200); // Respond to Telegram to acknowledge receipt
});

// **Function to Send Message to Telegram User**
// const sendMessage = async (chatId, text) => {
//     const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

//     try {
//         await axios.post(url, {
//             chat_id: chatId,
//             text: text
//         });
//     } catch (error) {
//         console.error("Error sending message:", error.response?.data || error.message);
//     }
// };

// **Set Webhook on Server Start**
const setWebhook = async () => {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_WEBHOOK_URL) {
        console.error("Telegram bot token or webhook URL is missing!");
        return;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${TELEGRAM_WEBHOOK_URL}`;
    // console.log(url);
    // try {
    //     const response = await axios.post(url);
    //     console.log("Webhook set successfully:", response.data);
    // } catch (error) {
    //     console.error("Error setting webhook:", error.response?.data || error.message);
    // }
    
};

app.get("/register", (req, res) => {
    res.send({ message: "Hello, this is a test!" });
    console.log('"Hello, this is a test!"');
});

// Set webhook when server starts
setWebhook();

// Start Server
app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
});

module.exports = initWebRouter;

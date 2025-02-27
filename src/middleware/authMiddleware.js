const jwt = require("jsonwebtoken");
const TelegramUser = require("../models/telegram"); // Ensure the correct path to your model

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        console.log("hello");
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token malformed" });
    }

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch User by telegram_id
    const user = await TelegramUser.findOne({ where: { telegram_id: decoded.telegram_id } });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }

    req.user = user; // Store the user in req.user
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Invalid token", details: error.message });
  }
};

module.exports = authMiddleware;

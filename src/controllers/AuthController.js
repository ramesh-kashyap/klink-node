const sequelize = require('../config/connectDB'); // Import Sequelize connection
const { QueryTypes } = require('sequelize');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // User Model Import Karein
require('dotenv').config();


// Register User Function
const register = async (req, res) => {
    try {
        const { fullname, lastname, selectedDate, email, password, referralCode } = req.body;
        
        if (!fullname || !lastname || !selectedDate || !email || !password || !referralCode) {
            // console.log('3');
            return res.status(400).json({ error: "All fields are required!" });
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
        if (!emailRegex.test(email)) {
          console.log('Invalid email address');
          return res.status(400).json({ error: 'Invalid email address.' });
        }



        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            // console.log('2');
            return res.status(400).json({ error: "Email already exists!" });
        }

        // Check if sponsor exists
        const sponsorUser = await User.findOne({ where: { username: referralCode } });
        if (!sponsorUser) {
            // console.log('1');
            return res.status(400).json({ error: "Sponsor does not exist!" });
        }

        // Generate username & transaction password
        const username = Math.floor(10000000 + Math.random() * 90000000);        
         const tpassword = Math.floor(10000+ Math.random() * 90000); 

        // Hash passwords
        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        const hashedTPassword = await bcrypt.hash(tpassword.toString(), 10);

        // Get last user for ParentId (assuming ParentId is determined this way)
        const lastUser = await User.findOne({ order: [['id', 'DESC']] });
        const parentId = lastUser ? lastUser.id : null;

        // Set sponsor level
        const sponsorLevel = sponsorUser.level ? sponsorUser.level : 0;

        // Create new user
        const newUser = await User.create({
            fullname:fullname,
            lastname:lastname,
            date_of_birth: selectedDate,
            email:email,
            username,
            password: hashedPassword,
            tpassword: hashedTPassword,
            PSR: password,
            TPSR: tpassword,
            sponsor: sponsorUser.id,
            level: sponsorLevel + 1,
            ParentId: parentId,
        });
    console.log(newUser);
    
        return res.status(201).json({status:true ,message: "User registered successfully!", username: newUser.username });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
};




// Export function



// Login User Function
const login = async (req, res) => {
    console.log('hello');

    try {
      // Destructure username and password from the request body.
      const { email, password } = req.body;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     
      if (!emailRegex.test(email)) {
        console.log('Invalid email address');
        return res.status(400).json({ error: 'Invalid email address.' });
      }
      if (!email || !password) {
        console.log('User not found!');
        return res.status(400).json({ error: "Username and Password are required!" });
      }
         
      // Find the user using Sequelize
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        console.log('User not found!')
        return res.status(400).json({ error: "User not found!" });

      }
  
      // Compare the provided password with the stored hashed password.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials!" });
      }
  
      // Generate a JWT token.
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,  
        { expiresIn: "1h" }
      );
  
      return res.status(200).json({
        status:true,
        message: "Login successful!",
        username: user.username,
        token,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ status:false , error: "Server error", details: error.message });
    }
  };
  



const logout = async (req, res) => {
    try {
        return res.json({ message: "User logged out successfully!" });
    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};


const loginWithTelegram = async (req, res) => {
    console.log(req.body);
    try {
        const { telegram_id, tusername, tname, tlastname } = req.body;

        console.log("🔹 Telegram ID:", telegram_id);

        if (!telegram_id) {
            return res.status(200).json({ message: "Telegram ID is required" });
        }

        // ✅ Check if user exists
        const queryCheckUser = `
            SELECT * FROM telegram_users WHERE telegram_id = :telegram_id
        `;

        const users = await sequelize.query(queryCheckUser, {
            replacements: { telegram_id },
            type: QueryTypes.SELECT,
        });
        if (users.length > 0) {
            // ✅ User exists, generate JWT token
            const user = users[0]; // Extract first user

            const token = jwt.sign(
                { id: user.id, telegram_id: user.telegram_id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({
                message: "Login successful",
                telegram_id: telegram_id,
                token,
            });
        } else {
            // ✅ Create new user
            const queryInsertUser = `
                INSERT INTO telegram_users (telegram_id, tusername, tname, tlastname) 
                VALUES (:telegram_id, :tusername, :tname, :tlastname)
            `;

            const [insertResult] = await sequelize.query(queryInsertUser, {
                replacements: { telegram_id, tusername, tname, tlastname },
                type: QueryTypes.INSERT,
            });

            // ✅ Generate JWT token for new user
            const token = jwt.sign(
                { id: insertResult, telegram_id }, // insertResult contains the new user ID
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(201).json({
                message: "Account created and logged in",
                telegram_id: telegram_id,
                token,
            });
        }
    } catch (error) {
        console.error("❌ Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};



const getUserDetails = async (req, res) => {
    try {
        const userId = req.user.id; // JWT ya session se logged-in user ka ID lein

        // User ka data database se fetch karein
        const user = await User.findOne({
            where: { id: userId }, // `id` ke basis par user ko fetch karein
        });

        if (!user) {
            return res.status(404).json({ error: "User not found", status: false });
        }

        return res.status(200).json({
            ...user.dataValues, // Poora user model ka data return karega
            status: true
        });

    } catch (error) {
        console.error("❌ Error fetching user details:", error);
        return res.status(500).json({ error: "Internal Server Error", status: false });
    }
};



module.exports = { login, register, logout,loginWithTelegram ,getUserDetails};


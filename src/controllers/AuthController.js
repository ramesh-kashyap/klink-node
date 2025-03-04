const sequelize = require('../config/connectDB'); // Import Sequelize connection
const { QueryTypes } = require('sequelize');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // User Model Import Karein
require('dotenv').config();


// Register User Function
const register = async (req, res) => {
  console.log(req.body);
    try {
      console.log("start");
        const { fullname, lastname,  date_of_birth, email, password, referralCode } = req.body;
       
        if (!fullname || !lastname || ! date_of_birth || !email || !password || !referralCode) {
            console.log('3');
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
        console.log("response",sponsorUser);

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
            date_of_birth:  date_of_birth,
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
      console.log("user:",user );
      // Compare the provided password with the stored hashed password.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid credentials!')
        return res.status(400).json({ error: "Invalid credentials!" });
      }
  
      // Generate a JWT token.
      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,  
       
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
  


  
  

  const setPin = async (req, res) => {
    try {
      console.log("Request received:", req.body); // Debugging
      const { email, pin } = req.body;

      // ✅ Corrected Query using `where`
      const user = await User.findOne({ where: { email: email } });

      console.log("User Found:", user ? user.email : "No user found"); // Debugging

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const hashedPin = await bcrypt.hash(pin, 10); // 10 = Salt Rounds

      // PIN ko update karo
      user.has_pin = hashedPin;
      user.pin = pin;
      await user.save();


       // Generate a JWT token.
       const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,  
       
      );
  
      return res.status(200).json({
        status:true,
        message: "Login successful!",
        username: user.username,
        token,
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: "Server error", error });
    }
};

  

  const verifyPin = async (req, res) => {
    try {
      
  
      const userId = req.user.id;
      const { pin } = req.body;
  
      console.log("User ID:", userId);
      console.log("Received PIN:", pin);
  
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      console.log("Stored PIN in DB:", pin);
  
      // Direct comparison (for plain text)
      if (!(await bcrypt.compare(pin, user.has_pin))) {
        console.log("PIN Mismatch: Incorrect old PIN");
        return res.status(400).json({ error: "Incorrect old PIN" });
      }
    
      return res.json({ status:true,message: "Old PIN verified successfully!" });
  
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({ status: false, error: "Server error", details: error.message });
    }
  };
  



  const updatePin = async (req, res) => {
    try {
      const userId = req.user.id;
      const { newPin, confirmPin } = req.body;
  
      // Validate if both PINs are provided
      if (!newPin || !confirmPin) {
        return res.status(400).json({ error: "Both PIN fields are required" });
      }
  

      if (newPin.length !== 4) {
        return res.status(400).json({ error: "PIN must be exactly 4 digits" });
      }
  
      // Check if new PIN and confirm PIN match
      if (newPin !== confirmPin) {
        return res.status(400).json({ error: "New PIN and Confirm PIN do not match" });
      }
  
      // Hash the new PIN before storing
      const hashedPin = await bcrypt.hash(newPin, 10);
  
      // Update user PIN in database
      await User.update({ pin: newPin,has_pin: hashedPin }, { where: { id: userId } });
  
      return res.json({ status: true, message: "PIN updated successfully!" });
    } catch (error) {
      console.error("Error updating PIN:", error.message);
      return res.status(500).json({ status: false,error: "Server error", details: error.message });
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


module.exports = { login, register, logout,loginWithTelegram ,verifyPin,updatePin,setPin };


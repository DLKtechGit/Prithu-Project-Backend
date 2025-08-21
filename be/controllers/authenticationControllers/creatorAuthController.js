const Creator = require('../../models/creatorModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');


// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Register New Creator
exports.createNewCreator = async (req, res) => {
  try {
    const { username, email, password,} = req.body;

    // Check if username or email already exists
    if (await Creator.findOne({ creatorUsername:username })) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (await Creator.findOne({ creatorEmail:email })) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new creator
    const creator = new Creator({
        creatorUsername:username,
      creatorEmail:email,
        creatorPasswordHash:passwordHash,

    });

    await creator.save();

    res.status(201).json({
      message: 'Creator registered successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Creator Login
exports.creatorLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
  

    // Find creator by username or email
    const creator = await Creator.findOne({
      $or: [{ creatorUsername: identifier }, { creatorEmail: identifier }],
    });
    if (!creator.creatorUsername) {
      return res.status(400).json({ error: 'Invalid username' });
    }



    if(!creator.creatorEmail)
    {
        res.status(400).json({error:'Invalid Email'})
    }

    const isMatch = await bcrypt.compare(password, creator.creatorPasswordHash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const userToken = jwt.sign(
      { userId:creator._id ,userName: creator.creatorUsername, role: creator.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token: userToken,
      creator: {
        creatorId: creator._id,
        creatorUserName: creator. creatorUsername,
        role: creator.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request Password Reset OTP
exports.creatorPasswordResetsendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const creator = await Creator.findOne({ email });
    if (!creator) {
      return res.status(400).json({ error: 'Email not found' });
    }

    // Generate 6-digit OTP and expiry (15 minutes)
    const tempOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);
     console.log(tempOtp)
    // Save OTP and expiry on creator document
    creator.otpCode = tempOtp;
    creator.otpExpiresAt = otpExpires;
    await creator.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: creator.creatorEmail,
      subject: 'Prithu Password Reset OTP',
      text: `Your OTP for password reset is: ${tempOtp}. It is valid for 15 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending OTP email:', error);
        return res.status(500).json({ error: 'Failed to send OTP email' });
      } else {
        console.log('OTP email sent:', info.response);
        return res.json({ message: 'OTP sent to email' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP
exports.creatorverifyOtp = async (req, res) => {
  try {
    
    const { email, otp } = req.body;
   
    const creator = await Creator.findOne({ creatorEmail:email });
    if (!creator) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!creator.otpCode || !creator.otpExpiresAt || creator.otpCode !== otp || creator.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password with OTP
exports.resetCreatorPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const creator = await Creator.findOne({ creatorEmail:email });
    if (!creator) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!creator.otpCode || !creator.otpExpiresAt || creator.otpCode !== otp || creator.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    creator.creatorPasswordHash = passwordHash;

    // Clear OTP fields after successful reset
    creator.otpCode = undefined;
    creator.otpExpiresAt = undefined;

    await creator.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

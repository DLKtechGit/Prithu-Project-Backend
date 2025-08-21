const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { generateReferralCode } = require('../middlewares/generateReferralCode'); 

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Register New User
exports.createNewUser = async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body;
      console.log({ username, email, password, referralCode} )
    // Check if username or email already exists
    if (await User.findOne({ username })) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate unique referral code for new user
    let referralCodeGenerated = generateReferralCode(username);
    while (await User.findOne({ referralCode: referralCodeGenerated })) {
      referralCodeGenerated = generateReferralCode(username);
    }

    // Find referring user by provided referral code
    let referredByUserId = null;
    if (referralCode) {
      const referringUser = await User.findOne({ referralCode: referralCode });
      if (!referringUser) {
        return res.status(400).json({ error: 'Invalid referral code' });
      }
      referredByUserId = referringUser._id;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      passwordHash,
      referralCode: referralCodeGenerated,
      referredByCode: referralCode || null,
      referredByUserId,
    });

     await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      referralCode: referralCodeGenerated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// User Login
exports.userLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username/email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username/email or password' });
    }

    const userToken = jwt.sign(
      { userName: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token: userToken,
      user: {
        userId: user._id,
        userName: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request Password Reset OTP
exports.userPasswordResetsendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }

    // Generate 6-digit OTP and expiry (15 minutes)
    const tempOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Save OTP and expiry on user document
    user.otpCode = tempOtp;
    user.otpExpiresAt = otpExpires;
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: user.email,
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
exports.verifyOtp = async (req, res) => {
  try {
    
    const { email, otp } = req.body;
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!user.otpCode || !user.otpExpiresAt || user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password with OTP
exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!user.otpCode || !user.otpExpiresAt || user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;

    // Clear OTP fields after successful reset
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;

    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

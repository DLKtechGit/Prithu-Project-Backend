const Admin = require('../../models/adminModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');
const otpStore=new Map();


// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Register New Admin
exports.newAdmin = async (req, res) => {
  try {
    const { username, email, password,} = req.body;

    console.log({ username, email, password,})
    // Check if username or email already exists
    if (await Admin.findOne({ username:username })) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (await Admin.findOne({ email:email })) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new Admin({
        username,
        email,
        passwordHash,

    });

    await admin.save();

    res.status(201).json({
      message: 'Admin registered successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
  

    // Find admin by username or email
    const admin = await Admin.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });
    if (!admin.username) {
      return res.status(400).json({ error: 'Invalid username' });
    }



    if(!admin.email)
    {
        res.status(400).json({error:'Invalid Email'})
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const userToken = jwt.sign(
      { userId:admin._id ,userName: admin.username, role: admin.adminType },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token: userToken,
      admin: {
        adminId: admin._id,
        adminUserName: admin. username,
        role: admin.adminType,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request Password Reset OTP
exports.adminSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let tempOtp = Math.floor(1000 + Math.random() * 9000).toString();
    let otpExpires;

    const user = await Admin.findOne({ email });

    if (user) {
      otpExpires = new Date(Date.now() + 5 * 60 * 1000);
      // Save OTP and expiry on user document
      user.otpCode = tempOtp;
      user.otpExpiresAt = otpExpires;
      await user.save();
    } else {
      otpExpires = Date.now() + 5 * 60 * 1000;
      // Store OTP and expiration for this email in otpStore
      otpStore.set(email, { tempOtp, expires: otpExpires });
    }

    // Send OTP email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Prithu Password Reset OTP',
      text: `Your OTP for password reset is: ${tempOtp}. It is valid for 15 minutes.`,
    };

    console.log(tempOtp)

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


exports.newAdminVerifyOtp = async (req, res) => {
    const { otp,email } = req.body;

  if (!otp||!email) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired' });
  }

  if (record.tempOtp === otp) {
    otpStore.delete(email);
    return res.status(200).json({
      verified: true,
      message: 'OTP verified successfully. You can now register.',
    });
  } else {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
};

// Verify OTP
exports.existAdminVerifyOtp = async (req, res) => {
  try {
    
    const {  otp } = req.body;
   
    const admin = await Admin.findOne({ otpCode:otp });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!admin.otpCode || !admin.otpExpiresAt || admin.otpCode !== otp || admin.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully',email:admin.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Reset Password with OTP
exports.adminPasswordReset = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const admin = await Admin.findOne({ email:email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    admin.passwordHash = passwordHash;

    // Clear OTP fields after successful reset
    admin.otpCode = undefined;
    admin.otpExpiresAt = undefined;

    await admin.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

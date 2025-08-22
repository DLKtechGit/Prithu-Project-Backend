const Business = require('../../models/businessModel');
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



// Register New Business
exports.createNewBusinessUser = async (req, res) => {
  try {
    const { username, email, password,} = req.body;

    // Check if username or email already exists
    if (await Business.findOne({ businessUsername:username })) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    if (await Business.findOne({ businessEmail:email })) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new business
    const business = new Business({
        businessUsername:username,
      businessEmail:email,
        businessPasswordHash:passwordHash,

    });

    await business.save();

    res.status(201).json({
      message: 'Business registered successfully',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Business Login
exports.businessLogin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
  

    // Find business by username or email
    const business = await Business.findOne({
      $or: [{ businessUsername: identifier }, { businessEmail: identifier }],
    });
    if (!business.businessUsername) {
      return res.status(400).json({ error: 'Invalid username' });
    }



    if(!business.businessEmail)
    {
        res.status(400).json({error:'Invalid Email'})
    }

    const isMatch = await bcrypt.compare(password, business.businessPasswordHash);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const userToken = jwt.sign(
      { userName: business.businessUsername, role: business.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token: userToken,
      business: {
        businessId: business._id,
        businessUserName: business. businessUsername,
        role: business.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Request Password Reset OTP
exports.businessPasswordResetsendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const business = await Business.findOne({  businessEmail:email });
    if (!business) {
      return res.status(400).json({ error: 'Email not found' });
    }

    // Generate 6-digit OTP and expiry (15 minutes)
    const tempOtp = Math.floor(100000 + Math.random() * 900000).toString();
     otpStore.set(email, { tempOtp, expires: Date.now() + 5 * 60 * 1000 }); 
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000 );
     console.log(tempOtp)
    // Save OTP and expiry on business document
    business.otpCode = tempOtp;
    business.otpExpiresAt = otpExpires;
    await business.save();

   

    // Send OTP email
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: business.businessEmail,
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


exports.newBusinessVerifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const record = otpStore.get(email);

  if (!record) {
    return res.status(400).json({ error: 'No OTP found for this email' });
  }

  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({ error: 'OTP has expired' });
  }

  if (record.tempOtp === otp) {
    otpStore.delete(email);

    // Successful OTP verification for new user (ready for registration)
    return res.status(200).json({
      verified: true,
      message: 'OTP verified successfully. You can now register.'
    });
  } else {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
};


exports.existBusinessVerifyOtp= async (req, res) => {
  try {
    
    const { email, otp } = req.body;
   
    const business = await Business.findOne({ businessEmail:email });
    if (!business) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!business.otpCode || !business.otpExpiresAt || business.otpCode !== otp || business.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password with OTP
exports.resetBusinessPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const business = await Business.findOne({ businessEmail:email });
    if (!business) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!business.otpCode || !business.otpExpiresAt || business.otpCode !== otp || business.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    business.businessPasswordHash = passwordHash;

    // Clear OTP fields after successful reset
    business.otpCode = undefined;
    business.otpExpiresAt = undefined;

    await business.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

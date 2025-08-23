const User = require('../../models/userModels/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { generateReferralCode } = require('../../middlewares/generateReferralCode');
const otpStore=new Map();


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
    console.log({ username, email, password, referralCode })
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

 let referredByUserId= null;
    // RefferalCode Validation
if (referralCode) {
  // Find user with this referral code who is still valid for referral usage
  const referringUser = await User.findOne({ referralCode });

  if (!referringUser || !referringUser.referralCodeIsValid) {
    return res.status(400).json({ message: 'Referral code is expired or invalid' });
  }

  // Check current referral count
  if (referringUser.referralcount >= 2) { // 2 is your limit
    // Optionally, mark referralCodeIsValid as false to make code invalid
    referringUser.referralCodeIsValid = false;
    await referringUser.save();

    return res.status(400).json({ message: 'Referral usage limit reached' });
  }
  // Increment referral count atomically
  referringUser.referralcount = (referringUser.referralcount || 0) + 1;
  await referringUser.save();
  
  await User.findByIdAndUpdate({
    referringUser:referredByUserId,
    
  },{$inc:{referralcount:1}})

  // Proceed with your referral reward logic
  referredByUserId  = referringUser._id;
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


    if (referralCode) {
      await User.findOneAndUpdate(
        { referralCode },
        { $addToSet: { referredPeople: user._id } }
      );
    }

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
exports.userSendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    let tempOtp = Math.floor(100000 + Math.random() * 900000).toString();
    let otpExpires;

    const user = await User.findOne({ email });

    if (user) {
      otpExpires = new Date(Date.now() + 15 * 60 * 1000);
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



// Verify OTP
exports.newUserVerifyOtp = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
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


exports.exitUserVerifyOtp = async (req, res) => {
  try {

    const { otp } = req.body;

    const user = await User.findOne({ otpCode:otp });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!user.otpCode || !user.otpExpiresAt || user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully',email:user.email });
    tempOtp='';
    otpExpires='';
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset Password with OTP
exports.userPasswordReset = async (req, res) => {
  try {
    const { email,newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email,and New assword are required' });
    }

    const user = await User.findOne({ email });
    // Hash new password securely
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


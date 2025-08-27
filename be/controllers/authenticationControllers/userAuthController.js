const User = require('../../models/userModels/userModel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const bcrypt = require('bcrypt');
const { generateReferralCode } = require('../../middlewares/generateReferralCode');
const otpStore=new Map();
const StoreUserDevice=require('../../models/devicetrackingModel');
const makeSessionService = require("../../services/sessionService");

const sessionService = makeSessionService(User,StoreUserDevice);


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
    const { identifier, password, role, roleRef } = req.body;

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

    // Generate JWT token
    const userToken = jwt.sign(
      { userName: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create session and get session id
    const deviceId = await sessionService.createSession(user._id,role,roleRef, userToken, req );
   
  

    // Send JSON response with token and user info
    res.json({
      token: userToken,
      deviceId,
      user: {
        userId: user._id,
        userName: user.username,
         email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Request Password Reset OTP
exports.userSendOtp = async (req, res) => {
  
    const email  = req.body.email;

if (!email) {
  return res.status(400).json({ error: 'Email is required' });
}

try {
  let tempOtp = Math.floor(1000 + Math.random() * 9000).toString();
  let otpExpires;
  
  // Find user by email
  const user = await User.findOne({ email });
  
  if (user) {
    // OTP valid for 15 minutes for existing users
    otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.otpCode = tempOtp;
    user.otpExpiresAt = otpExpires;
    await user.save();
  } else {
    // For non-registered
    //  users, store in temporary OTP store with 5 minutes expiration
    console.log('non-register user')
    otpExpires = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { tempOtp, expires: otpExpires });
  }

  // Prepare email options
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'Prithu Password Reset OTP',
    text: `Your OTP for password reset is: ${tempOtp}. It is valid for 15 minutes.`,
  };

  console.log(tempOtp)
  
  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending OTP email:', error);
      return res.status(500).json({ error: 'Failed to send OTP email' });
    }
    console.log('OTP email sent:', info.response);
    return res.json({ message: 'OTP sent to email' });
  });
} catch (error) {
  res.status(500).json({ error: error.message });
}
}



// Verify OTP
exports.newUserVerifyOtp = async (req, res) => {
  const { otp ,email} = req.body;

  if (!otp||!email) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }
   const record = otpStore.get(email);

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


exports.existUserVerifyOtp = async (req, res) => {
  try {

    const { otp } = req.body;
    
    const user = await User.findOne({ otpCode:otp });

   
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or OTP' });
    }

    if (!user.otpCode || !user.otpExpiresAt || user.otpCode !== otp || user.otpExpiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    res.json({ message: 'OTP verified successfully',
      email:user.email });

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


exports.userlogOut= async (req, res) => {
  req.user.activeSession = null;
  req.user.isOnline = false;
  req.user.lastSeen = new Date();
  await req.user.save();
  res.clearCookie("sessionId");
  res.json({ message: "Logged out" });
};

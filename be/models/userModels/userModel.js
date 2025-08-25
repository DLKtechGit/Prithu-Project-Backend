const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  

  // Referral system
  referralCode: { type: String, unique: true, index: true },
  referredByCode: { type: String },
  referralCodeUsageLimt: { type: Number, default: 2 },
  referralCodeIsValid: { type: Boolean, default: true },
  referredByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralcount: { type: Number, default: 0 },
  referredPeople: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Preferences
  websiteLanguage: { type: String, default: 'en' },
  feedLanguage: { type: String, default: 'en' },
  interests: { type: [String], default: [] },

  // Feed interactions
  likedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],
  downloadedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],
  viewedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],
  totalFeedsWatchDuration: { type: Number, default: 0 },
  commandedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feeds' }],


  // Profile
  profileSettings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProfilesSettings' }],

  // Role and following system
  role: { type: String, enum: ['admin', 'creator', 'user', 'business'], default: 'user' },

  // Creator follow system
  followingCreators: [{
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
    followedAt: { type: Date, default: Date.now }
  }],
  totalFollowingCreators: { type: Number, default: 0 },

  // General following/followers (for creator-as-user)
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Creator' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Session and notifications
  activeSession: { type: String, default: null },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: null },
  fcmTokens: { type: [String], default: [] },

  // Account activity
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },

  // OTP
  otpCode: { type: String },
  otpExpiresAt: { type: Date },

  // Terms and conditions
  termsAccepted: { type: Boolean, required: true, default: false },
  termsAcceptedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema, 'User');

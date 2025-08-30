const mongoose =require("mongoose");
const bcrypt =require("bcrypt");

// Device sub-schema
const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceType: { type: String, enum: ["web", "mobile"], required: true },
  ipAddress: { type: String },
  lastActiveAt: { type: Date, default: Date.now },
});

// Final merged User schema
const UserSchema = new mongoose.Schema(
  {
    // Basic info
    userName: {
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
    referredByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    referralcount: { type: Number, default: 0 },
    referredPeople: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Preferences
    websiteLanguage: { type: String, default: "en" },
    feedLanguage: { type: String, default: "en" },
    interests: { type: [String], default: [] },

    // Feed interactions
    likedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feed" }],
    downloadedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feed" }],
    savedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feed" }],
    viewedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feed" }],
    totalFeedsWatchDuration: { type: Number, default: 0 },
    commentFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feeds" }],

    // Profile
    profileSettings: [
      { type: mongoose.Schema.Types.ObjectId, ref: "ProfilesSettings" },
    ],

    // Role and following system
    role: {
      type: String,
      enum: ["Admin", "Creator", "User", "Business"],
      default: "User",
    },

    // Creator follow system
    followingCreators: [
      {
        creatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Creator" },
        followedAt: { type: Date, default: Date.now },
      },
    ],
    totalFollowingCreators: { type: Number, default: 0 },

    // General following/followers
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Creator" }],

    // Devices & session
    devices: { type: [DeviceSchema], default: [] },
    activeSession: { type: String, default: null },
    isOnline: { type: Boolean, default: false, index: true },
    lastSeen: { type: Date, default: null },
    lastSeenAt: { type: Date, default: null },
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

  trialUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Password comparison method
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports= mongoose.models.User || mongoose.model("User", UserSchema,"User");

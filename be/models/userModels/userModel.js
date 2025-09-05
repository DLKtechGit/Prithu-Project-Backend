const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Device sub-schema
const DeviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceType: { type: String, enum: ["web", "mobile"], required: true },
  ipAddress: { type: String },
  lastActiveAt: { type: Date, default: Date.now },
});


const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    appLanguage: { type: String, default: "en" },

    feedLanguage: { type: String, default: "en" },

    // Roles the user owns (e.g., ["User", "Creator"])
    roles: [{ type: String, enum: ["User", "Business", "Creator"], default: ["User"] }],

    // Currently active account reference
    activeAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },

    profileSettings:{type: mongoose.Schema.Types.ObjectId, ref: "ProfileSettings"},

    // Keep track of all accounts created by this user
    accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }], // ✅ NEW

    // Role-specific profile data (optional, since Account schema will hold most info)
    userProfile: { type: mongoose.Schema.Types.ObjectId, ref: "UserProfile" },
    creatorProfile: { type: mongoose.Schema.Types.ObjectId, ref: "CreatorProfile" },
    businessProfile: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessProfile" },

    // Referral system
    referralCode: { type: String, unique: true, index: true },
    referredByCode: { type: String },
    referralCodeUsageLimit: { type: Number, default: 0 },
    referralCodeIsValid: { type: Boolean, default: true },
    referredByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    referralCount: { type: Number, default: 0 },

    // Preferences
    appLanguage: { type: String, default: "en" },
    feedLanguage: { type: String, default: "en" },
    categories: { type: [String], default: [] },

    // Devices & session
    devices: { type: [DeviceSchema], default: [] },
    activeSession: { type: String, default: null },
    isOnline: { type: Boolean, default: false, index: true },
    lastSeenAt: { type: Date, default: null },
    fcmTokens: { type: [String], default: [] },

    // Account activity
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },

    // OTP
    otpCode: { type: String },
    otpExpiresAt: { type: Date },

    // Terms
    termsAccepted: { type: Boolean, required: true, default: false },
    termsAcceptedAt: { type: Date },

    trialUsed: { type: Boolean, default: false },
  },
  { timestamps: true }
);




module.exports = mongoose.models.User || mongoose.model("User", UserSchema, "User");

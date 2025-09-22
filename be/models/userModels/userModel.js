const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },

    roles: { type: [String], enum: ["User", "Business", "Creator"], default: ["User"] },
    activeAccount: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    accounts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
    profileSettings: { type: mongoose.Schema.Types.ObjectId, ref: "ProfileSettings" },

    referralCode: { type: String, unique: true, index: true },
    referredByCode: { type: String, default: null },
    referredByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    // track direct children (who user referred)
    directReferrals: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // side under the immediate parent (left/right)
    sideUnderParent: { type: String, enum: ["left", "right", null], default: null },

    // earnings & progression
    currentLevel: { type: Number, default: 1 },
    currentTier: { type: Number, default: 1 },
    lastPromotedAt: { type: Date },
    isTierComplete: { type: Boolean, default: false },
    totalEarnings: { type: Number, default: 0 },
    withdrawableEarnings: { type: Number, default: 0 },

    // referral code validity: becomes true only after subscription activation
    referralCodeIsValid: { type: Boolean, default: false },

    // count of direct referrals who actually subscribed (used to deactivate code once reaches 2)
    directSubscribedCount: { type: Number, default: 0 },

    // legacy usage fields (optional)
    referralCodeUsageCount: { type: Number, default: 0 },
    referralCodeUsageLimit: { type: Number, default: 2 },

    referralCount: { type: Number, default: 0 },

    // subscription object
    subscription: {
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },

    // ✅ NEW: hold users until the opposite side is balanced
    holdLeft: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    holdRight: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    fcmTokens: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    lastActiveAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
    termsAccepted: { type: Boolean, required: true, default: false },
    termsAcceptedAt: { type: Date },
    trialUsed: { type: Boolean, default: false },
    hiddenPostIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feed" }],
    isBlocked: { type: String }
  },
  { timestamps: true }
);

UserSchema.index({ referredByUserId: 1 });
UserSchema.index({ referralCodeIsValid: 1 });

UserSchema.pre("save", function (next) {
  if (this.subscription) this.subscription.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema, "User");

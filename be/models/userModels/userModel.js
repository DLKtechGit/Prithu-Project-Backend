const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



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


     sideUnderParent: { type: String, enum: ["left", "right", null], default: null },


      // earnings & progression
  currentLevel: { type: Number, default: 1 },
  currentTier: { type: Number, default: 1 },
  lastPromotedAt: { type: Date },
  isTierComplete: { type: Boolean, default: false },
  totalEarnings: { type: Number, default: 0 },
  withdrawableEarnings: { type: Number, default: 0 },



    referralCodeUsageLimit: { type: Number, default: 0 },
    
    referralCodeIsValid: { type: Boolean, default: false},


    referralCodeUsageCount: { type: Number, default: 0 },

    referralCount: { type: Number, default: 0 },

  
   
   
    subscription: {
      isActive: { type: Boolean, default: false },
      startDate: { type: Date },
      endDate: { type: Date },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    },
    fcmTokens: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
    lastActiveAt: { type: Date, default: Date.now },
    lastLoginAt: { type: Date },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
    termsAccepted: { type: Boolean, required: true, default: false },
    termsAcceptedAt: { type: Date },
    trialUsed: { type: Boolean, default: false },
    hiddenPostIds: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Feed" }
  ],
  isBlocked:{type:String}
    //* User Session Detail *//
  },
  { timestamps: true }
);

UserSchema.index({ referredByUserId: 1 });
UserSchema.index({ referralCodeIsValid: 1 });

UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  if (this.subscription) this.subscription.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema, "User");

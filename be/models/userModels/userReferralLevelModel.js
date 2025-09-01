const mongoose = require("mongoose");

const UserReferralLevelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // person who follows
  userLevel: { type: Number, required: true },
  levelLimit: { type: Number, required: true },
  tier: { type: Number, required: true },
  referringPeople: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now }
});
UserReferralLevelSchema.index({ userId: 1, userLevel: 1 }, { unique: true });

module.exports = mongoose.model("UserReferralLevel", UserReferralLevelSchema, "UserReferralLevel");

const mongoose = require("mongoose");

const HeldReferralSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // who is waiting
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // the held referral
  side: { type: String, enum: ["left", "right"], required: true },                 // side it belongs to
  level: { type: Number, required: true },                                         // level where it was held
  createdAt: { type: Date, default: Date.now }
});

HeldReferralSchema.index({ parentId: 1, userId: 1, level: 1 }, { unique: true });

module.exports = mongoose.model("HeldReferral", HeldReferralSchema, "HeldReferrals");

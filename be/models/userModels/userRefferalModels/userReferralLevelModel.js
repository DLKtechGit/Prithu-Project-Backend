const mongoose = require("mongoose");

const UserLevelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  level: { type: Number, required: true },
  tier: { type: Number, required: true },
  threshold: { type: Number, required: true },
  levelLimit: { type: Number },
  leftTreeCount: { type: Number, default: 0 },
  rightTreeCount: { type: Number, default: 0 },
  leftCarryOver: { type: Number, default: 0 },
  rightCarryOver: { type: Number, default: 0 },
  referringPeople: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  shareAmount: { type: Number, default: 250 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserLevelSchema.index({ userId: 1, level: 1, tier: 1 }, { unique: true });
UserLevelSchema.index({ userId: 1 });

UserLevelSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("UserLevel", UserLevelSchema, "UserLevels");

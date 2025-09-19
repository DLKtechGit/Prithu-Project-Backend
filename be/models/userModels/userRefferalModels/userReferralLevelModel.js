const mongoose = require("mongoose");

const UserLevelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  level: { type: Number, required: true },
  tier: { type: Number, required: true },
  threshold: { type: Number, required: true },
  leftTreeCount: { type: Number, default: 0 },   // total finished on left for this level
  rightTreeCount: { type: Number, default: 0 },  // total finished on right for this level
  leftCarryOver: { type: Number, default: 0 },
  rightCarryOver: { type: Number, default: 0 },
  shareAmount: { type: Number, default: 250 }, // fixed ₹250 per level
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserLevelSchema.index({ userId: 1, level: 1, tier: 1 }, { unique: true });
UserLevelSchema.pre("save", function(next){ this.updatedAt = Date.now(); next(); });

module.exports = mongoose.model("UserLevel", UserLevelSchema, "UserLevels");

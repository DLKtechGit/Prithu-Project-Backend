const mongoose = require("mongoose");

const UserLevelSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  level: { type: Number, required: true },
  tier: { type: Number, required: true },
  // threshold is PER-SIDE: for level N per-side threshold = 2^(N-1)
  threshold: { type: Number, required: true },

  leftTreeCount: { type: Number, default: 0 },
  rightTreeCount: { type: Number, default: 0 },
  leftCarryOver: { type: Number, default: 0 },
  rightCarryOver: { type: Number, default: 0 },

  // record exact user ids that subscribed and filled left/right slots at this level
  leftUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  rightUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  heldUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],


  holdLeft: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ new
  holdRight: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // bookkeeping for earnings
  shareAmount: { type: Number, default: 250 }, // fixed ₹250 per level
  earnedAmount: { type: Number, default: 0 },
  pendingAmount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

UserLevelSchema.index({ userId: 1, level: 1, tier: 1 }, { unique: true });
UserLevelSchema.pre("save", function(next){
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("UserLevel", UserLevelSchema, "UserLevels");

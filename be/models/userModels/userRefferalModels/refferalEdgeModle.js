const mongoose = require("mongoose");

const ReferralEdgeSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Level info
  level: { type: Number, required: true, default: 1 }, // level number in parent's tree
  side: { type: String, enum: ["left", "right"], required: true },

  // Tier tracking
  tier: { type: Number, default: 1 }, // which tier this referral belongs to

  // Carry-over handling
  carryOver: { type: Number, default: 0 }, // overflow users if imbalance

  // Status tracking
  completed: { type: Boolean, default: false }, // marks if this edge fulfilled its requirement

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 🔑 Indexes for performance & uniqueness
ReferralEdgeSchema.index({ parentId: 1, level: 1, side: 1, createdAt: 1 });
ReferralEdgeSchema.index({ childId: 1 });
ReferralEdgeSchema.index({ parentId: 1, childId: 1 }, { unique: true });

// Auto update `updatedAt`
ReferralEdgeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("ReferralEdge", ReferralEdgeSchema, "ReferralEdges");

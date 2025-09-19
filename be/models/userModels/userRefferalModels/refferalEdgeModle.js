const mongoose = require("mongoose");

const ReferralEdgeSchema = new mongoose.Schema({
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  side: { type: String, enum: ["left", "right"], required: true },
  level: { type: Number, required: true, default: 1 },
  tier: { type: Number, required: true, default: 1 },
  // finished when child + parent conditions met (parent active at time child activated)
  status: { type: String, enum: ["incomplete", "finished"], default: "incomplete" },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ReferralEdgeSchema.index({ parentId: 1, childId: 1 }, { unique: true });
ReferralEdgeSchema.index({ parentId: 1, side: 1 });
ReferralEdgeSchema.pre("save", function(next){
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("ReferralEdge", ReferralEdgeSchema, "ReferralEdges");

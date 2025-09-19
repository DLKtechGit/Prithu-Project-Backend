const mongoose = require("mongoose");

const UserEarningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // the earner (parent)
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // triggering child
  level: { type: Number, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

UserEarningSchema.index({ userId: 1, level: 1 });
module.exports = mongoose.model("UserEarning", UserEarningSchema, "UserEarnings");

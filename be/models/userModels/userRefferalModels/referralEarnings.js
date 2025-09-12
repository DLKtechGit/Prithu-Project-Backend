const mongoose = require("mongoose");

const UserEarningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  level: { type: Number, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserEarning", UserEarningSchema, "UserEarnings");

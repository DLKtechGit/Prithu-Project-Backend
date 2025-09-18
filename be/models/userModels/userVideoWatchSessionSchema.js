// models/WatchSession.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const WatchSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  feedId: { type: Schema.Types.ObjectId, ref: "Feed", required: true },
  watchedSeconds: { type: Number, required: true },
  watchedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("WatchSession", WatchSessionSchema,"WatchSession");

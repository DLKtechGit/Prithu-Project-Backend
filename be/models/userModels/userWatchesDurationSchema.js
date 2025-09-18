// models/UserWatchStats.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserWatchStatsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },

  // global totals
  totalSeconds: { type: Number, default: 0 },
  sessionsCount: { type: Number, default: 0 },

  // breakdown per feed
  feeds: {
    type: Map,
    of: new Schema({
      watchedSeconds: { type: Number, default: 0 },
      sessions: { type: Number, default: 0 },
      lastWatched: { type: Date, default: Date.now }
    }),
    default: {}
  },

  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// Virtual: total hours
UserWatchStatsSchema.virtual("totalHours").get(function () {
  return +(this.totalSeconds / 3600).toFixed(3);
});

// Method: add a watch session
UserWatchStatsSchema.methods.addSession = async function({ feedId, seconds = 0, when = new Date() }) {
  if (seconds <= 0) return this;

  this.totalSeconds += seconds;
  this.sessionsCount += 1;

  const feedObj = this.feeds.get(feedId) || { watchedSeconds: 0, sessions: 0, lastWatched: null };
  feedObj.watchedSeconds += seconds;
  feedObj.sessions += 1;
  feedObj.lastWatched = when;
  this.feeds.set(feedId, feedObj);

  this.lastUpdated = new Date();
  return this.save();
};

module.exports = mongoose.model("UserWatchStats", UserWatchStatsSchema,"UserWatchStats");

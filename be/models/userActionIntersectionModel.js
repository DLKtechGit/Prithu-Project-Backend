
const mongoose =require ("mongoose");

const UserFeedActionInteractionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  feedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feed",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["like", "save", "download", "view", "share"],  // 🔥 added share
    required: true,
    index: true,
  },

  lastDownloadedAt: { type: Date },

  // Extra fields for share & view
  watchDuration: { type: Number, default: 0 }, // used only for "view"
  shareChannel: {                               // used only for "share"
    type: String,
    enum: ["whatsapp", "facebook", "twitter", "instagram", "linkedin", "email", "copy_link", "other"],
  },
  shareTarget: { type: String }, // e.g. "group", "timeline", "direct", optional

  createdAt: { type: Date, default: Date.now },
});

//  Prevent duplicate like/save/download per user-feed
UserFeedActionInteractionSchema.index(
  { userId: 1, feedId: 1, type: 1 },
  { unique: true, partialFilterExpression: { type: { $in: ["like", "save"] } } }
);

//  Views can repeat
UserFeedActionInteractionSchema.index(
  { feedId: 1, type: 1, createdAt: -1 },
  { partialFilterExpression: { type: "view" } }
);

//  Shares can repeat (user might share multiple times)
UserFeedActionInteractionSchema.index(
  { feedId: 1, type: 1, createdAt: -1 },
  { partialFilterExpression: { type: "share" } }
);

module.exports = mongoose.model("UserFeedActionInteraction", UserFeedActionInteractionSchema,"UserFeedActionInteraction");
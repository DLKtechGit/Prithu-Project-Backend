const mongoose = require("mongoose");

const UserCommentSchema = new mongoose.Schema({
  // Either userId or accountId will be present
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", index: true },

  feedId: { type: mongoose.Schema.Types.ObjectId, ref: "Feed", required: true, index: true },
  commentText: { type: String, required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "UserComment", default: null },

  createdAt: { type: Date, default: Date.now },

  // Subdocument replies (quick nested replies, lightweight use case)
  replies: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
      commentText: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("UserComment", UserCommentSchema, "UserComments");

const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    feedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feeds", // reported feed
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // user who reported
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "Spam",
        "Nudity",
        "Violence",
        "Hate Speech",
        "Harassment",
        "Misinformation",
        "Other",
      ],
      required: true,
    },
    description: {
      type: String, // optional extra explanation
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Action Taken", "Rejected"],
      default: "Pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admins", // which admin reviewed the report
      default: null,
    },
    actionTaken: {
      type: String, // e.g., "Feed Removed", "User Warned", etc.
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reports", ReportSchema,"Reports");

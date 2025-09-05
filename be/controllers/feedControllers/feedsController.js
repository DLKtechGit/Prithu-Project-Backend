const Feed = require('../../models/feedModel');
const User = require('../../models/userModels/userModel');
const Creator = require('../../models/creatorModel');
const { feedTimeCalculator } = require('../../middlewares/feedTimeCalculator');
const UserFeedActionInteraction =require('../../models/userFeedInterSectionModel.js');
const fs = require('fs');
const path=require('path');
const mongoose = require('mongoose');
const Account =require("../../models/accountSchemaModel.js")
const Admin=require("../../models/adminModels/adminModel.js")




exports.getAllFeeds = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId; // optional fallback
    const accountId = req.accountId || req.body.accountId || null; // primary if exists

    // Step 1: Fetch feeds
    const feeds = await Feed.find()
      .sort({ createdAt: -1 })
      .populate("createdByAccount") // dynamically references Account or Admin via refPath
      .select("usreId type contentUrl category createdAt createdByAccount roleRef");

    if (!feeds.length) {
      return res.status(404).json({ message: "No feeds found" });
    }

    const feedIds = feeds.map((feed) => feed._id);

    // Step 2: Aggregate interactions
    const interactions = await UserFeedActionInteraction.aggregate([
      { $match: { feedId: { $in: feedIds } } },
      {
        $group: {
          _id: { feedId: "$feedId", type: "$type" },
          count: { $sum: 1 },
        },
      },
    ]);

    const interactionMap = {};
    interactions.forEach((i) => {
      const fid = i._id.feedId.toString();
      if (!interactionMap[fid]) {
        interactionMap[fid] = { like: 0, share: 0, comment: 0, download: 0 };
      }
      interactionMap[fid][i._id.type] = i.count;
    });

    // Step 3: Determine which ID to use for likes
    const likeQuery = { feedId: { $in: feedIds }, type: "like" };
    if (accountId) {
      likeQuery.accountId = new mongoose.Types.ObjectId(accountId);
    } else if (userId) {
      likeQuery.userId = new mongoose.Types.ObjectId(userId);
    }

    const likedFeeds = await UserFeedActionInteraction.find(likeQuery)
      .select("feedId -_id")
      .lean();

    const likedFeedIds = likedFeeds.map((like) => like.feedId.toString());

    // Step 4: Build enriched feed response
    const enrichedFeeds = await Promise.all(
      feeds.map(async (feed) => {
        const account = feed.createdByAccount;
        let userName = "Unknown";
        let profileAvatar = "Unknown";

      if (feed.roleRef === "Account" && account) {
  // Populate userId first, then profileSettings from userId
  const acc = await Account.findById(account._id)
    .populate({
      path: "userId",
      select: "userName profileSettings",
      populate: {
        path: "profileSettings",
        select: "profileAvatar"
      }
    })
    .lean();

  userName = acc?.userId?.userName || "Unknown";

  profileAvatar = acc?.userId?.profileSettings?.profileAvatar
    ? `http://192.168.1.48:5000/uploads/images/${path.basename(
        acc.userId.profileSettings.profileAvatar
      )}`
    : "Unknown";
}else if (feed.roleRef === "Admin" && account) {
          // Admin role: populate profileSetting
          const adm = await Admin.findById(account._id)
            .populate("profileSettings", "profileAvatar")
            .lean();

          userName = adm?.userName || "Admin";
          profileAvatar = adm?.profileSettings?.profileAvatar
            ? `http://192.168.1.48:5000/uploads/images/${path.basename(
                adm.profileSettings.profileAvatar
              )}`
            : "Unknown";
        }

        const folder = feed.type === "video" ? "videos" : "images";
        const contentUrlFull = feed.contentUrl
          ? `http://192.168.1.48:5000/uploads/${folder}/${path.basename(
              feed.contentUrl
            )}`
          : null;

        const counts = interactionMap[feed._id.toString()] || {
          like: 0,
          share: 0,
          comment: 0,
          download: 0,
        };

        return {
          feedId: feed._id,
          userName,
          profileAvatar,
          timeAgo: feedTimeCalculator(feed.createdAt),
          contentUrl: contentUrlFull,
          likesCount: counts.like,
          shareCount: counts.share,
          commentsCount: counts.comment,
          downloadsCount: counts.download,
          isLiked: likedFeedIds.includes(feed._id.toString()),
        };
      })
    );

    res.status(200).json({
      message: "Feeds retrieved successfully",
      feeds: enrichedFeeds,
    });
  } catch (error) {
    console.error("Error in getAllFeeds:", error);
    res.status(500).json({ message: "Server error" });
  }
};

















exports.feedsWatchByUser = async (req, res) => {
  try {
    const { feedId, userId, watchDurationSeconds } = req.body;

    // Find the feed by ID
    const feed = await Feed.findById({ _id: feedId });
    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    // Update viewedBy: add or update entry for this user
    const existingView = feed.viewedBy.find(v => v.userId.toString() === userId);
    if (existingView) {
      existingView.watchTime += watchDurationSeconds; // increment watch time
      existingView.viewedAt = new Date();
    } else {
      feed.viewedBy.push({
        userId,
        viewedAt: new Date(),
        watchTime: watchDurationSeconds
      });
    }

    // Save the feed document update
    await feed.save();

    // Update creator totalFeedWatchDuration by incrementing
    await Creator.findByIdAndUpdate(
      feed.createdBy,
      { $inc: { totalFeedWatchDuration: watchDurationSeconds } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $inc: { totalFeedsWatchDuration: watchDurationSeconds },
        $addToSet: { viewedFeeds: feedId }
      },
      { new: true }
    )

    return res.status(200).json({
      message: 'Feed watch updated successfully',
      feed,
    });
  } catch (error) {
    console.error('Error updating feed watch:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};









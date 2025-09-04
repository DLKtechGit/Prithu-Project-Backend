const Feed = require('../../models/feedModel');
const User = require('../../models/userModels/userModel');
const Creator = require('../../models/creatorModel');
const { feedTimeCalculator } = require('../../middlewares/feedTimeCalculator');
const UserFeedActionInteraction =require('../../models/userFeedInterSectionModel.js');
const fs = require('fs');
const path=require('path');




exports.getAllFeeds = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId;      // optional fallback
    const accountId = req.accountId || req.body.accountId || null;  // primary if exists

    const feeds = await Feed.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "createdByAccount",
        populate: [
          { path: "userId", select: "userName" },
          { path: "profileData", select: "profileAvatar" }
        ]
      })
      .select("type contentUrl category createdAt");

    if (!feeds.length) {
      return res.status(404).json({ message: "No feeds found" });
    }

    const feedIds = feeds.map(feed => feed._id);

    // Aggregate interactions
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
    interactions.forEach(i => {
      const fid = i._id.feedId.toString();
      if (!interactionMap[fid]) {
        interactionMap[fid] = { like: 0, share: 0, comment: 0, download: 0 };
      }
      interactionMap[fid][i._id.type] = i.count;
    });

    // Determine which ID to use for likes
    const likeQuery = { feedId: { $in: feedIds }, type: "like" };
    if (accountId) {
      likeQuery.accountId = mongoose.Types.ObjectId(accountId);
    } else if (userId) {
      likeQuery.userId = mongoose.Types.ObjectId(userId);
    }

    const likedFeeds = await UserFeedActionInteraction.find(likeQuery)
      .select("feedId -_id")
      .lean();

    const likedFeedIds = likedFeeds.map(like => like.feedId.toString());

    // Build response
    const enrichedFeeds = feeds.map(feed => {
      const account = feed.createdByAccount;
      const user = account?.userId;
      const profile = account?.profileData;

      const folder = feed.type === "video" ? "videos" : "images";
      const contentUrlFull = feed.contentUrl
        ? `http://192.168.1.77:5000/uploads/${folder}/${path.basename(feed.contentUrl)}`
        : null;

      const counts = interactionMap[feed._id.toString()] || {
        like: 0,
        share: 0,
        comment: 0,
        download: 0,
      };

      return {
        feedId: feed._id,
        userName: user?.userName || "Unknown",
        profileAvatar: profile?.profileAvatar
          ? `http://192.168.1.77:5000/uploads/images/${path.basename(profile.profileAvatar)}`
          : "Unknown",
        timeAgo: feedTimeCalculator(feed.createdAt),
        contentUrl: feed.contentUrl,
        contentUrlFull,
        likesCount: counts.like,
        shareCount: counts.share,
        commentsCount: counts.comment,
        downloadsCount: counts.download,
        isLiked: likedFeedIds.includes(feed._id.toString()), // ✅ based on accountId if exists, else userId
      };
    });

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









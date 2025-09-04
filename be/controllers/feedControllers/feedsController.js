const Feed = require('../../models/feedModel');
const User = require('../../models/userModels/userModel');
const Creator = require('../../models/creatorModel');
const Account = require('../../models/accountSchemaModel');
const { feedTimeCalculator } = require('../../middlewares/feedTimeCalculator');
const UserFeedActionInteraction =require('../../models/userFeedInterSectionModel.js');
const fs = require('fs');
const path=require('path');

exports.getAllFeeds = async (req, res) => {
  try {
    const feeds = await Feed.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "createdByAccount", // Feed -> Account
        populate: {
          path: "profileData", // Account -> Profile
          select: "userName profileAvatar" // only fetch these fields
        }
      });

    if (!feeds.length) {
      return res.status(404).json({ message: "No feeds found" });
    }

    const enrichedFeeds = await Promise.all(
      feeds.map(async (feed) => {
        const feedObj = feed.toObject();

        // Creator info
        const account = feed.createdByAccount;
        
        const profile = account?.profileData;

        feedObj.creatorUsername = profile?.userName || "Unknown";
        feedObj.creatorAvatar = profile?.profileAvatar
          ? `http://192.168.1.77:5000/uploads/images/${path.basename(profile.profileAvatar)}`
          : "Unknown";

        // Content URL with folder based on type
        const folder = feed.type === "video" ? "videos" : "images";
        feedObj.contentUrlFull = feed.contentUrl
          ? `http://192.168.1.77:5000/uploads/${folder}/${path.basename(feed.contentUrl)}`
          : null;

        // Category
        feedObj.category = feed.category || "Uncategorized";

        // Count likes and shares
        feedObj.likesCount = await UserFeedActionInteraction.countDocuments({
          feedId: feed._id,
          type: "like",
        });
        feedObj.shareCount = await UserFeedActionInteraction.countDocuments({
          feedId: feed._id,
          type: "share",
        });

        // Time ago
        feedObj.timeAgo = feedTimeCalculator(feed.createdAt);

        return feedObj;
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









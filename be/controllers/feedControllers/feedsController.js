const Feed = require('../../models/feedModel');
const User = require('../../models/userModels/userModel');
const Creator = require('../../models/creatorModel');
const { feedTimeCalculator } = require('../../middlewares/feedTimeCalculator');
const Profile = require('../../models/profileSettingModel');
const UserFeedActionInteraction =require('../../models/userActionIntersectionModel');

exports.getAllFeeds = async (req, res) => {
  try {
    // 1. Get all feeds from DB sorted by latest
    const feeds = await Feed.find().sort({ createdAt: -1 });

    if (!feeds || feeds.length === 0) {
      return res.status(404).json({ message: 'No feeds found' });
    }

    // 2. Loop each feed and enrich it with extra data
    const enrichedFeeds = await Promise.all(
      feeds.map(async (feed) => {
        const feedObj = feed.toObject(); // plain JS object

        // 3. Fetch creator profile
        const creatorProfile = await Profile.findOne({ userId: feed.createdBy });

        // 4. Count likes & shares from interaction table
        const likeCount = await UserFeedActionInteraction.countDocuments({
          feedId: feed._id,
          type: "like"
        });
        const shareCount = await UserFeedActionInteraction.countDocuments({
          feedId: feed._id,
          type: "share"
        });

        // 5. Attach new fields to feed object
        feedObj.likesCount = likeCount || 0;
        feedObj.shareCount = shareCount || 0;
        feedObj.creatorUsername = creatorProfile?.creatorUsername || 'Unknown';
        feedObj.profileAvatar = creatorProfile?.profileAvatar || 'Unknown';

        // 6. Add "time ago" field
        feedObj.timeAgo = feedTimeCalculator(new Date(feedObj.createdAt));

        return feedObj;
      })
    );

    // 7. Send response
    return res.status(200).json({
      message: 'Feeds retrieved successfully',
      feeds: enrichedFeeds,
    });

  } catch (error) {
    console.error('Error fetching feeds:', error);
    return res.status(500).json({ message: 'Server error' });
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





// exports.mostWatchedFeeds=async(req,res)=>
// {
//   const feeds=await Feed.find()
//   if(feeds){return res.status(400).json({message:"No Feeds Found"})}

//   const mostWatched=feeds.maxWatchHours>
// }




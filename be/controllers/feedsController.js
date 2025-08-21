const Feed = require('../models/feedModel');
const User=require('../models/userModel');
const Creator=require('../models/creatorModel')

exports.getAllFeeds = async (req, res) => {
  try {
    // Get all feeds sort
    const feeds = await Feed.find().sort({ createdAt: -1 }).populate({path:'createdBy',select:'creatorUsername creatorEmail'}); 

    if (!feeds || feeds.length === 0) {
      return res.status(404).json({ message: 'No feeds found' });
    }

    return res.status(200).json({
      message: 'Feeds retrieved successfully',
      feeds,
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
    const feed = await Feed.findById({_id:feedId});
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
      { $inc: { totalFeedWatchDuration:watchDurationSeconds } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      userId,
      {
         $inc :{totalFeedsWatchDuration:watchDurationSeconds},
          $addToSet:{viewedFeeds:feedId}
        },
      {new:true}
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

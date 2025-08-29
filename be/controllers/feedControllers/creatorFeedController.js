const Feed = require('../../models/feedModel');
const Creator = require('../../models/creatorModel');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const Tags = require('../../models/tagModel');




exports.creatorFeedUpload = async (req, res) => {

  try {
    const creatorId = req.params.id;
    console.log(creatorId);
    const fileUrl = `http://192.168.1.48:5000/uploads/${req.file.mimetype.startsWith('video/') ? 'videos' : 'images'}/${req.file.filename}`;
    const { language, category, tags = [], type } = req.body;
 
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
 
    const existFeed = await Feed.findOne({ contentUrl: fileUrl });
    if (existFeed) {
      return res.status(400).json({ message: 'The video has already been uploaded' });
    }
 
    let videoDuration = null;
    let displayUrl = fileUrl;
 
    if (type === 'video' && req.file.mimetype.startsWith('video/')) {
      videoDuration = await getVideoDurationInSeconds(req.file.path);
   
      if (videoDuration >= 90.0) {
        return res.status(400).json({ message: 'Upload video below 90 seconds' });
      }
      // For video, use the video file URL
      displayUrl = fileUrl; // Already set to /uploads/videos/
    } else {
      // For non-video, use the image file URL
      displayUrl = fileUrl; // Already set to /uploads/images/
    }
 
    const newFeed = new Feed({
      type,
      language,
      tags,
      category,
      duration: videoDuration,
      createdBy: creatorId,
      contentUrl: fileUrl,
      displayUrl: displayUrl,
    });
 
    await newFeed.save();
 
    await Creator.findByIdAndUpdate(
      creatorId,
      { $push: { feeds: newFeed._id } },
      { new: true }
    );
 
    return res.status(201).json({
      message: 'Feed created successfully',
      feed: newFeed,
    });
  } catch (error) {
    console.error('Error creating feed:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
 





exports.creatorFeedDelete = async (req, res) => {
  try {
    const creatorId = req.userId;
    const feedId = req.params.id;

    // Find the feed 
    const feed = await Feed.findById(feedId);

    if (!feed) {
      return res.status(404).json({ message: 'Feed not found' });
    }

    // Check ownership
    if (feed.createdBy.toString() !== creatorId) {
      return res.status(403).json({ message: 'Unauthorized to delete this feed' });
    }

    // Delete the feed document from DB
    await Feed.findByIdAndDelete(feedId);

    // Remove feed reference from creator
    await Creator.findByIdAndUpdate(
      creatorId,
      { $pull: { feeds: feedId } },
      { new: true }
    );

    // Delete the file from uploads folder
    if (feed.contentUrl) {
      fs.unlink(feed.contentUrl, (err) => {
        if (err) {
          console.error('Failed to delete file:', err);

        } else {
          console.log('Uploaded file deleted:', feed.contentUrl);
        }
      });
    }

    return res.status(200).json({ message: 'Feed deleted successfully' });
  } catch (error) {
    console.error('Error deleting feed:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};




exports.getCreatorFeeds = async (req, res) => {
  try {
    const creatorId = req.userId;


    const feeds = await Feed.find({ createdBy: creatorId }).sort({ createdAt: -1 });

    if (!feeds || feeds.length === 0) {
      return res.status(404).json({ message: 'No feeds found for this creator' });
    }

    return res.status(200).json({
      message: 'Creator feeds retrieved successfully',
      feeds,
    });
  } catch (error) {
    console.error('Error fetching creator feeds:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};





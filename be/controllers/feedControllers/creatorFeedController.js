const Feed = require('../../models/feedModel');
const Creator = require('../../models/creatorModel');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const Tags = require('../../models/tagModel');




exports.creatorFeedUpload = async (req, res) => {

  console.log('creator feed upload initiated')
  try {
    const creatorId = req.params.id;
    const { language, category, type, tags } = req.body;
 

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log(req.file.path)
    const existFeed = await Feed.findOne({ contentUrl: req.file.path });
    console.log(existFeed)
    if (existFeed) {
      return res.status(400).json({ message: 'The video has already been uploaded' });
    }

    let videoDuration = null;
    if (type === 'video' && req.file.mimetype.startsWith('video/')) {
      videoDuration = await getVideoDurationInSeconds(req.file.path);
      if (videoDuration >= 90.0) {
        return res.status(400).json({ message: 'Upload video below 90 seconds' });
      }
    }

    const newFeed = new Feed({
      type,
      language,
      tags,
      category,
      duration: videoDuration,
      createdBy: creatorId,
      contentUrl: req.file.path,
    });
    await newFeed.save();

    // Handle tags
    let tagParse;
    if (typeof tags === 'string') {
      try {
        tagParse = JSON.parse(tags);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid tags format' });
      }
    }
    for (const tagName of tagParse) {

      let tag = await Tags.findOne({ name: tagName });  
      if (tag) {
        await Tags.findOneAndUpdate(
          { name: tagName },
          { $addToSet: { feedIds: newFeed._id } }
        );
      } else {
        // Create new tag document
        tag = new Tags({
          name: tagName,
          feedIds:[newFeed._id]
        });
        await tag.save().then(data=> {console.log('tag saved')})
      }
    }

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





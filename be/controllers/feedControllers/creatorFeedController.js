const Feed = require('../../models/feedModel');
const Creator = require('../../models/creatorModel');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const Tags = require('../../models/tagModel');
const path =require ('path');




exports.creatorFeedUpload = async (req, res) => {
  try {
    const creatorId = req.params.id;

    if (!creatorId) {
      return res.status(400).json({ message: "Creator ID is required" });
    }

    // Construct file URL
    const fileUrl = `http://192.168.1.77:5000/uploads/${
      req.file.mimetype.startsWith("video/") ? "videos" : "images"
    }/${req.file.filename}`;
 
    const { language, category, type, tags } = req.body;

    if (!language || !category || !type || !tags) {
      return res.status(400).json({ message: "Language, category, and type and Tag required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
 
    const newFileName = path.basename(req.file.path);

// Check if feed with same basename exists
const existFeed = await Feed.findOne({
  contentUrl: { $regex: `${newFileName}$` }, // match ending with same filename
});

if (existFeed) {
  return res
    .status(400)
    .json({ message: "The file has already been uploaded" });
}
 
    // Handle video duration check
    let videoDuration = null;
    if (type === "video" && req.file.mimetype.startsWith("video/")) {
      videoDuration = await getVideoDurationInSeconds(req.file.path);
      if (videoDuration >= 90.0) {
        return res
          .status(400)
          .json({ message: "Upload video below 90 seconds" });
      }
    }
 
    // ✅ Parse tags properly
    let tagParse = [];
    if (typeof tags === "string") {
      try {
        // Try JSON.parse first
        tagParse = JSON.parse(tags);
        if (!Array.isArray(tagParse)) {
          throw new Error("Parsed tags is not an array");
        }
      } catch (e) {
        // If not JSON, try comma separated
        tagParse = tags.split(",").map((t) => t.trim());
      }
    } else if (Array.isArray(tags)) {
      tagParse = tags;
    }
 
    // Save new feed
    const newFeed = new Feed({
      type,
      language,
      tags: tagParse, // ✅ always array
      category,
      duration: videoDuration,
      createdBy: creatorId,
      contentUrl: req.file.path,
    });
    await newFeed.save();
 
    // Save/update tags collection
    for (const tagName of tagParse) {
      let tag = await Tags.findOne({ name: tagName });
      if (tag) {
        await Tags.findOneAndUpdate(
          { name: tagName },
          { $addToSet: { feedIds: newFeed._id } }
        );
      } else {
        tag = new Tags({
          name: tagName,
          feedIds: [newFeed._id],
        });
        await tag.save();
      }
    }
 
    // Update creator with feed reference
    await Creator.findByIdAndUpdate(
      creatorId,
      { $push: { feeds: newFeed._id } },
      { new: true }
    );
 
    return res.status(201).json({
      message: "Feed created successfully",
      feed: newFeed,
    });
  } catch (error) {
    console.error("Error creating feed:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
 
 







exports.creatorFeedDelete = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const creatorId = req.userId;
    const feedId = req.feedId;

    if (creatorId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Creator ID is required" });
    }

    if (!feedId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Feed ID is required" });
    }

    // Find the feed 
    const feed = await Feed.findById(feedId).session(session);
    if (!feed) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Feed not found" });
    }

    // Check ownership
    if (feed.createdBy.toString() !== creatorId) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized to delete this feed" });
    }

    // Delete the feed document
    await Feed.findByIdAndDelete(feedId).session(session);

    // Remove feed reference from creator
    await Creator.findByIdAndUpdate(
      creatorId,
      { $pull: { feeds: feedId } },
      { new: true, session }
    );

    // Remove feed references from tags
    await Tags.updateMany(
      { feedIds: feedId },
      { $pull: { feedIds: feedId } },
      { session }
    );

    // Optionally delete tags that now have no feeds
    await Tags.deleteMany({ feedIds: { $size: 0 } }).session(session);

    await session.commitTransaction();
    session.endSession();

    // Delete file from uploads after DB transaction
    if (feed.contentUrl) {
      const filePath = path.join(__dirname, "../uploads", feed.contentUrl); // adjust path as needed
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
        else console.log("Uploaded file deleted:", filePath);
      });
    }

    return res.status(200).json({ message: "Feed deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting feed:", error);
    return res.status(500).json({ message: "Server error" });
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





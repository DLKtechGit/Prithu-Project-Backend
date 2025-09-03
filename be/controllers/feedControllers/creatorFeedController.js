const Feed = require('../../models/feedModel');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const Tags = require('../../models/categorySchema');
const path =require ('path');
const Account=require("../../models/accountSchemaModel");
const {feedTimeCalculator}=require("../../middlewares/feedTimeCalculator");
const {getActiveCreatorAccount}=require("../../middlewares/creatorAccountactiveStatus");




exports.creatorFeedUpload = async (req, res) => {
  try {
    const userId = req.Id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }


    const activeAccount = await getActiveCreatorAccount(userId);
    if (!activeAccount) {
      return res.status(403).json({ message: "Active Creator account required to upload feed" });
    }
    const creatorAccountId = activeAccount._id;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = `http://192.168.1.77:5000/uploads/${
      req.file.mimetype.startsWith("video/") ? "videos" : "images"
    }/${req.file.filename}`;

    const { language, category, type, tags } = req.body;
    if (!language || !category || !type || !tags) {
      return res.status(400).json({ message: "Language, category, type, and tags are required" });
    }

    // Prevent duplicate upload
    const newFileName = path.basename(req.file.path);
    const existFeed = await Feed.findOne({ contentUrl: { $regex: `${newFileName}$` } });
    if (existFeed) return res.status(400).json({ message: "The file has already been uploaded" });

    // Video duration check
    let videoDuration = null;
    if (type === "video" && req.file.mimetype.startsWith("video/")) {
      videoDuration = await getVideoDurationInSeconds(req.file.path);
      if (videoDuration >= 90.0) {
        return res.status(400).json({ message: "Upload video below 90 seconds" });
      }
    }

    // Parse tags
    let tagParse = [];
    if (typeof tags === "string") {
      try {
        tagParse = JSON.parse(tags);
        if (!Array.isArray(tagParse)) throw new Error();
      } catch {
        tagParse = tags.split(",").map((t) => t.trim());
      }
    } else if (Array.isArray(tags)) tagParse = tags;

    // Save feed
    const newFeed = new Feed({
      type,
      language,
      tags: tagParse,
      category,
      duration: videoDuration,
      createdByAccount: creatorAccountId,
      contentUrl: req.file.path,
    });
    await newFeed.save();

    console.log("hi")

    // Update tags
    for (const tagName of tagParse) {
      let tag = await Tags.findOne({ name: tagName });
      if (tag) {
        await Tags.findOneAndUpdate({ name: tagName }, { $addToSet: { feedIds: newFeed._id } });
      } else {
        await new Tags({ name: tagName, feedIds: [newFeed._id] }).save();
      }
    }

    // Update active account with feed reference
    await Account.findByIdAndUpdate(creatorAccountId, { $push: { feeds: newFeed._id } });

    return res.status(201).json({ message: "Feed created successfully", feed: newFeed });
  } catch (error) {
     console.error("Error creating feed:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
 
 







exports.creatorFeedDelete = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.Id;
    const activeAccount = await getActiveCreatorAccount(userId);
    if (!activeAccount) {
      await session.abortTransaction();
      return res
        .status(403)
        .json({ message: "Only active Creator account can delete feeds" });
    }
    const creatorId = activeAccount._id;
    const { feedId } = req.body;

    if (!feedId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Feed ID is required" });
    }

    const feed = await Feed.findById(feedId).session(session);
    if (!feed) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Feed not found" });
    }

    if (feed.createdBy.toString() !== creatorId.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized to delete this feed" });
    }

    await Feed.findByIdAndDelete(feedId).session(session);

    await Account.findByIdAndUpdate(
      creatorId,
      { $pull: { feeds: feedId } },
      { new: true, session }
    );

    await Tags.updateMany(
      { feedIds: feedId },
      { $pull: { feedIds: feedId } },
      { session }
    );
    await Tags.deleteMany({ feedIds: { $size: 0 } }).session(session);

    await session.commitTransaction();
    session.endSession();

    if (feed.contentUrl) {
      const filePath = path.join(__dirname, "../uploads", feed.contentUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete file:", err);
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
    const userId = req.Id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const activeAccount = await getActiveCreatorAccount(userId);
    if (!activeAccount) {
      return res
        .status(403)
        .json({ message: "Only active Creator account can fetch feeds" });
    }
    const creatorId = activeAccount._id;

    const feeds = await Feed.find({ createdBy: creatorId }).sort({ createdAt: -1 });
    if (!feeds || feeds.length === 0) {
      return res.status(404).json({ message: "No feeds found for this creator" });
    }

    const feedsWithTimeAgo = feeds.map((feed) => ({
      ...feed.toObject(),
      timeAgo: feedTimeCalculator(feed.createdAt),
    }));

    return res.status(200).json({
      message: "Creator feeds retrieved successfully",
      count: feedsWithTimeAgo.length,
      feeds: feedsWithTimeAgo,
    });
  } catch (error) {
    console.error("Error fetching creator feeds:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};





exports.creatorFeedScheduleUpload = async (req, res) => {
  try {
    const userId = req.Id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const activeAccount = await getActiveCreatorAccount(userId);
    if (!activeAccount) {
      return res
        .status(403)
        .json({ message: "Only active Creator account can upload feeds" });
    }
    const creatorId = activeAccount._id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `http://192.168.1.77:5000/uploads/${
      req.file.mimetype.startsWith("video/") ? "videos" : "images"
    }/${req.file.filename}`;

    const { language, category, type, tags, scheduledAt } = req.body;

    if (!language || !category || !type || !tags) {
      return res
        .status(400)
        .json({ message: "Language, category, type, and tags required" });
    }

    const newFileName = path.basename(req.file.path);
    const existFeed = await Feed.findOne({
      contentUrl: { $regex: `${newFileName}$` },
    });
    if (existFeed) {
      return res.status(400).json({ message: "The file has already been uploaded" });
    }

    let videoDuration = null;
    if (type === "video" && req.file.mimetype.startsWith("video/")) {
      videoDuration = await getVideoDurationInSeconds(req.file.path);
      if (videoDuration >= 90.0) {
        return res.status(400).json({ message: "Upload video below 90 seconds" });
      }
    }

    // Parse tags
    let tagParse = [];
    if (typeof tags === "string") {
      try {
        tagParse = JSON.parse(tags);
        if (!Array.isArray(tagParse)) throw new Error();
      } catch {
        tagParse = tags.split(",").map((t) => t.trim());
      }
    } else if (Array.isArray(tags)) {
      tagParse = tags;
    }

    // Parse scheduledAt
    let scheduleDate = null;
    if (scheduledAt) {
      scheduleDate = new Date(scheduledAt);
      if (isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ message: "Invalid scheduledAt date" });
      }
    }

    const newFeed = new Feed({
      type,
      language,
      tags: tagParse,
      category,
      duration: videoDuration,
      createdBy: creatorId,
      contentUrl: req.file.path,
      scheduledAt: scheduleDate,
      isPosted: scheduleDate ? false : true,
    });
    await newFeed.save();

    if (!scheduleDate) {
      for (const tagName of tagParse) {
        let tag = await Tags.findOne({ name: tagName });
        if (tag) {
          await Tags.findOneAndUpdate(
            { name: tagName },
            { $addToSet: { feedIds: newFeed._id } }
          );
        } else {
          tag = new Tags({ name: tagName, feedIds: [newFeed._id] });
          await tag.save();
        }
      }
    }

    await Account.findByIdAndUpdate(creatorId, { $push: { feeds: newFeed._id } });

    return res.status(201).json({
      message: scheduledAt
        ? "Feed scheduled successfully (tags will activate when posted)"
        : "Feed created successfully",
      feed: newFeed,
    });
  } catch (error) {
    console.error("Error creating feed:", error);
    return res.status(500).json({ message: "Server error" });
  }
};






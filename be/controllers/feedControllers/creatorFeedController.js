const Feed = require('../../models/feedModel');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const Tags = require('../../models/categorySchema');
const path =require ('path');
const Account=require("../../models/accountSchemaModel");
const {feedTimeCalculator}=require("../../middlewares/feedTimeCalculator");
const {getActiveCreatorAccount}=require("../../middlewares/creatorAccountactiveStatus");
const Categories=require('../../models/categorySchema');


 
 
exports.creatorFeedUpload = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId;

    console.log("req.file",req.file)

    const fileUrl = `http://192.168.1.48:5000/uploads/${req.file.mimetype.startsWith('video/') ? 'videos' : 'images'}/${req.file.filename}`;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const activeAccount = await getActiveCreatorAccount(userId);
    if (!activeAccount) {
      return res.status(403).json({ message: "Active Creator account required to upload feed" });
    }

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const { language, category, type } = req.body;
    if (!language || !category || !type) {
      return res.status(400).json({ message: "Language, category, and type are required" });
    }

    // Capitalize first letter of category
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

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

    // Save feed with formatted category name
    const newFeed = new Feed({
      type,
      language,
      category: formattedCategory, // string with first letter capital
      duration: videoDuration,
      createdByAccount: activeAccount._id,
      contentUrl: fileUrl,
    });
    await newFeed.save();

    // Check if category exists (case-insensitive)
    let categoryDoc = await Categories.findOne({
      name: { $regex: `^${formattedCategory}$`, $options: "i" },
    });

    if (categoryDoc) {
      // Category exists → push feed ID
      await Categories.findByIdAndUpdate(categoryDoc._id, { $push: { feedIds: newFeed._id } });
    } else {
      // Category doesn't exist → create new category with feed ID
      const newCategory = new Categories({
        name: formattedCategory,
        feedIds: [newFeed._id],
      });
      await newCategory.save();
    }

    return res.status(201).json({ message: "Feed created successfully", feed: newFeed });
  } catch (error) {
    console.error("Error creating feed:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
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

    // ✅ Check creator ownership
    if (feed.createdByAccount.toString() !== creatorId.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ message: "Unauthorized to delete this feed" });
    }

    // Delete feed
    await Feed.findByIdAndDelete(feedId).session(session);

    // Remove feed from creator account
    await Account.findByIdAndUpdate(
      creatorId,
      { $pull: { feeds: feedId } },
      { new: true, session }
    );

    // Remove feed from categories
    await Category.updateMany(
      { feedIds: feedId },
      { $pull: { feedIds: feedId } },
      { session }
    );

    // Optional: delete empty categories
    await Category.deleteMany({ feedIds: { $size: 0 } }).session(session);

    await session.commitTransaction();
    session.endSession();

    // Delete file from uploads
    if (feed.contentUrl) {
      const folder = feed.type === "video" ? "videos" : "images";
      const filePath = path.join(__dirname, "../uploads", folder, path.basename(feed.contentUrl));
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

    // ✅ Fetch feeds created by this creator account
    const feeds = await Feed.find({ createdByAccount: creatorId }).sort({ createdAt: -1 });

    if (!feeds || feeds.length === 0) {
      return res.status(404).json({ message: "No feeds found for this creator" });
    }

    // ✅ Add timeAgo property
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
  console.log("working")
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

    const { language, category, type, scheduledAt } = req.body;

    if (!language || !category || !type) {
      return res
        .status(400)
        .json({ message: "Language, category, and type required" });
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

    // Parse scheduledAt
    let scheduleDate = null;
    if (scheduledAt) {
      scheduleDate = new Date(scheduledAt);
      if (isNaN(scheduleDate.getTime())) {
        return res.status(400).json({ message: "Invalid scheduledAt date" });
      }
    }

    // ✅ Capitalize first letter of category
    const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();

    // Create feed
    const newFeed = new Feed({
      type,
      language,
      category: formattedCategory,
      duration: videoDuration,
      createdByAccount: creatorId,
      contentUrl: req.file.path,
      scheduledAt: scheduleDate,
      isPosted: scheduleDate ? false : true,
    });
    await newFeed.save();

    // ✅ Handle Category collection
    let categoryDoc = await Category.findOne({
      name: { $regex: new RegExp(`^${formattedCategory}$`, "i") },
    });

    if (categoryDoc) {
      await Category.findByIdAndUpdate(categoryDoc._id, {
        $addToSet: { feedIds: newFeed._id },
      });
    } else {
      categoryDoc = new Category({
        name: formattedCategory,
        feedIds: [newFeed._id],
      });
      await categoryDoc.save();
    }

    await Account.findByIdAndUpdate(creatorId, { $push: { feeds: newFeed._id } });

    return res.status(201).json({
      message: scheduleDate
        ? "Feed scheduled successfully (category will update when posted)"
        : "Feed created successfully",
      feed: newFeed,
    });
  } catch (error) {
    console.error("Error creating feed:", error);
    return res.status(500).json({ message: "Server error" });
  }
};







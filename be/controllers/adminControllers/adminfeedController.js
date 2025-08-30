const Feed = require('../../models/feedModel');
const Admin= require('../../models/adminModels/adminModel');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const Tags = require('../../models/tagModel');
const path =require ('path');

exports.adminFeedUpload = async (req, res) => {
  try {
    const adminId = req.params.id;

    if (!adminId) {
      return res.status(400).json({ message: "Admin ID is required" });
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
      createdBy: adminId,
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
    await Admin.findByIdAndUpdate(
      Admin,
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
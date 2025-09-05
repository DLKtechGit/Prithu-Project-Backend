const Feed = require('../../models/feedModel');
const Admin= require('../../models/adminModels/adminModel');
const { getVideoDurationInSeconds } = require('get-video-duration');
const fs = require('fs');
const Tags = require('../../models/categorySchema');
const path =require ('path');
const Categories = require('../../models/categorySchema');



exports.adminFeedUpload = async (req, res) => {
 
  try {
     const userId = req.Id || req.body.userId;      // optional fallback
    //  const userId = req.body.userId;
     if (!userId) {
       return res.status(400).json({ message: "User ID is required" });
     }
     const userRole= await Admin.findById(userId).select('adminType');
     if(!userRole || userRole.adminType !=='Admin'){
       return res.status(403).json({ message: "Only Admins can upload feeds" });
     }
    const { language, category, type } = req.body;
 
    if (!userId) {
 
      return res.status(400).json({ message: "User ID is required" });
 
    }
 
    if (!language || !category || !type) {
 
      return res
 
        .status(400)
 
        .json({ message: "Language, type, and category are required" });
 
    }
 
    if (!req.file) {
 
      return res.status(400).json({ message: "No file uploaded" });
 
    }
 
    const newFileName = path.basename(req.file.path);
 
    // Check if feed with same basename exists
 
    const existFeed = await Feed.findOne({
 
      contentUrl: { $regex: `${newFileName}$` },
 
    });
 
    if (existFeed) {
 
      return res
 
        .status(400)
 
        .json({ message: "The file has already been uploaded" });
 
    }
 
    // Handle video duration
 
    let videoDuration = null;
 
    if (type === "video" && req.file.mimetype.startsWith("video/")) {
 
      videoDuration = await getVideoDurationInSeconds(req.file.path);
 
      if (videoDuration >= 90.0) {
 
        return res
 
          .status(400)
 
          .json({ message: "Upload video below 90 seconds" });
 
      }
 
    }
 
    // Capitalize category name
 
    const formattedCategory =
 
      category.charAt(0).toUpperCase() + category.slice(1);
 
    // Save new feed
 
    const newFeed = new Feed({
 
      type,
 
      language,
 
      category: formattedCategory, // ✅ single category
 
      duration: videoDuration,
 
      createdByAccount: userId,
 
      contentUrl: req.file.path,
     
      roleRef: userRole.role, // from fetched user role
 
    });
 
    await newFeed.save();
 
    // Update/create category with feed reference
 
    let cat = await Categories.findOne({ name: formattedCategory });
 
    if (cat) {
 
      await Categories.findOneAndUpdate(
 
        { name: formattedCategory },
 
        { $addToSet: { feedIds: newFeed._id } }
 
      );
 
    } else {
 
      cat = new Categories({
 
        name: formattedCategory,
 
        feedIds: [newFeed._id],
 
      });
 
      await cat.save();
 
    }
 
 
    return res.status(201).json({
 
      message: "Feed created successfully",
 
      feed: newFeed,
 
    });
 
  } catch (error) {
 
    console.error("Error creating feed:", error);
 
    return res.status(500).json({ message: "Server error" });
 
  }
 
};
 
 
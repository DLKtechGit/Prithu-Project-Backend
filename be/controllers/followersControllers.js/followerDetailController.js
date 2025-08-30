const Follower = require("../../models/followerModel");
const Creator = require("../../models/creatorModel");
const mongoose = require("mongoose");


exports.followCreator = async (req, res) => {
  try {
    const userId = req.body.userId;
    const creatorId = req.body.creatorId;

    if (!userId || !creatorId) {
      return res.status(400).json({ message: "User ID and Creator ID are required" });
    }


    if (userId === creatorId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const creator = await Creator.findById(creatorId);
    if (!creator || creator.role !== "creator") {
      return res.status(404).json({ message: "Creator not found" });
    }

    // Create follow relation
    await Follower.create({ userId, creatorId });

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already following" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};



exports.unfollowCreator = async (req, res) => {
  try {
    const userId = req.body.userId;
    const creatorId = req.body.creatorId;

    if (!userId || !creatorId) {
      return res.status(400).json({ message: "User ID and Creator ID are required" });
    }

    const deleted = await Follower.findOneAndDelete({ userId, creatorId });

    if (!deleted) {
      return res.status(400).json({ message: "You are not following this creator" });
    }

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};




exports.getUserFollowers = async (req, res) => {
  if (!req.body.userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const followers = await Follower.find({ userId: req.body.userId })
      .populate({
        path: "creatorId",
        select: "userName profileSettings",
        populate: {
          path: "profileSettings",
          select: "profileAvatar"
        }
      });

    const formattedFollowers = followers.map(f => {
      return {
        userName: f.creatorId?.userName || "Unavailable",
        profileAvatar: f.creatorId?.profileSettings?.profileAvatar || "Unavailable",
      };
    });

    res.status(200).json({
      count: formattedFollowers.length,
      followers: formattedFollowers
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};





exports.getCreatorFollowers = async (req, res) => {
  const { creatorId } = req.body;

  console.log("Received creatorId:", creatorId);

  if (!creatorId) {
    return res.status(400).json({ message: "Creator ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(creatorId)) {
    return res.status(400).json({ message: "Invalid Creator ID" });
  }

  try {
    const followers = await Follower.find({ creatorId })
      .populate({
        path: "userId",
        select: "userName profileSettings",
        populate: {
          path: "profileSettings",
          select: "profileAvatar",
        }
      });

      console.log("Fetched followers:", followers);

    const formattedFollowers = followers.map(f => ({
      userName: f.userId?.userName || "Unavailable",
      profileAvatar: f.userId?.profileSettings?.profileAvatar || "Unavailable"
    }));

    return res.status(200).json({
      count: formattedFollowers.length,
      followers: formattedFollowers
    });
  } catch (error) {
    console.error("Error fetching followers:", error);
    return res.status(500).json({ message: "Server error", error });
  }
};

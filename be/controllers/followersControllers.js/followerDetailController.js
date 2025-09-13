const Follower = require("../../models/followerModel");
const Account=require('../../models/accountSchemaModel')
const mongoose = require("mongoose");




exports.followAccount = async (req, res) => {
  try {
    const currentUserId = req.Id || req.body.userId; // logged-in user
    const accountId = req.body.accountId; // account to follow

    if (!currentUserId || !accountId) {
      return res.status(400).json({ message: "Follower and Target account IDs are required" });
    }

    // 1️⃣ Get the target account
    const targetAccount = await Account.findById(accountId).lean();
    if (!targetAccount || targetAccount.type !== "Creator") {
      return res.status(404).json({ message: "Creator account not found" });
    }

    const targetUserId = targetAccount.userId.toString();

    // 2️⃣ Prevent self-follow
    if (currentUserId.toString() === targetUserId) {
      return res.status(400).json({ message: "You cannot follow your own account" });
    }

    // 3️⃣ Check if Follower document exists
    let followerDoc = await Follower.findOne({ userId: targetUserId });

    // 4️⃣ If document exists, check if user already followed
    if (followerDoc) {
      const alreadyFollowed = followerDoc.followerIds.some(
        (f) => f.userId.toString() === currentUserId.toString()
      );
      if (alreadyFollowed) {
        return res.status(400).json({ message: "You already followed this Creator" });
      }

      // 5️⃣ Add current user to followerIds
      followerDoc.followerIds.push({ userId: currentUserId, createdAt: new Date() });
      await followerDoc.save();
    } else {
      // 6️⃣ Create new follower document if not exists
      followerDoc = await Follower.create({
        userId: targetUserId,
        followerIds: [{ userId: currentUserId, createdAt: new Date() }],
      });
    }

    res.status(200).json({ message: "Followed successfully", followerDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Unfollow an account
exports.unFollowAccount = async (req, res) => {
  try {
    const currentUserId = req.Id; // logged-in user
    const accountId = req.body.accountId; // account to unfollow

    if (!currentUserId || !accountId) {
      return res.status(400).json({ message: "Follower and Target account IDs are required" });
    }

    // 1️⃣ Get the target account
    const targetAccount = await Account.findById(accountId).lean();
    if (!targetAccount) {
      return res.status(404).json({ message: "Target account not found" });
    }

    const targetUserId = targetAccount.userId.toString();

    // 2️⃣ Find or create Follower document for target user
    let followerDoc = await Follower.findOne({ userId: targetUserId });
    if (!followerDoc) {
      return res.status(400).json({ message: "You are not following this account" });
    }

    // 3️⃣ Check if user is in followerIds
    const isFollowing = followerDoc.followerIds.some(
      (f) => f.userId.toString() === currentUserId.toString()
    );

    if (!isFollowing) {
      // Check if already in nonFollowerIds
      const alreadyUnfollowed = followerDoc.nonFollowerIds.some(
        (nf) => nf.userId.toString() === currentUserId.toString()
      );
      if (alreadyUnfollowed) {
        return res.status(400).json({ message: "You already unfollowed this account" });
      }

      // Not following, but add to nonFollowerIds
      followerDoc.nonFollowerIds.push({ userId: currentUserId, createdAt: new Date() });
      await followerDoc.save();

      return res.status(200).json({ message: "You are now in non-followers list", followerDoc });
    }

    // 4️⃣ Pull from followerIds and push to nonFollowerIds
    followerDoc.followerIds = followerDoc.followerIds.filter(
      (f) => f.userId.toString() !== currentUserId.toString()
    );

    followerDoc.nonFollowerIds.push({ userId: currentUserId, createdAt: new Date() });

    await followerDoc.save();

    res.status(200).json({ message: "Unfollowed successfully", followerDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all followers of the current account
exports.getAccountFollowers = async (req, res) => {
  try {
    const accountId = req.accountId;

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const followers = await Follower.find({ followingAccountId: accountId })
      .populate({
        path: "userId",
        populate: {
          path: "profileData", // ProfileSettings ref
          select: "profileAvatar"
        }
      })
      .populate({
        path: "userId",
        populate: {
          path: "userId", // User ref inside Account
          select: "userName email"
        }
      });

    const formatted = followers.map(f => {
      return {
        userName: f.userId?.userId?.userName || "Unavailable",
        email: f.userId?.userId?.email || "Unavailable",
        profileAvatar: f.userId?.profileData?.profileAvatar || "Unavailable"
      };
    });

    res.status(200).json({
      count: formatted.length,
      followers: formatted
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};






exports.getCreatorFollowers = async (req, res) => {
  const  creatorId  = req.accountId;

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

const path = require("path");
const UserFeedActions = require("../models/userFeedInterSectionModel");
const Feed = require("../models/feedModel");
const UserComment = require("../models/userModels/userCommentModel");
const UserView = require("../models/userModels/userViewFeedsModel");
const CommentLike = require("../models/userModels/commentsLikeModel");

// ---------------------- FEED LIKE ----------------------
exports.creatorlikeFeed = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;
  const feedId = req.body.feedId;

  if (!feedId) return res.status(400).json({ message: "feedId required" });
  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    const filter = { $or: [{ userId }, { accountId }] };
    const result = await UserFeedActions.findOneAndUpdate(
      filter,
      { $addToSet: { likedFeeds: feedId } },
      { upsert: true, new: true }
    );

    const isLiked = result.likedFeeds.includes(feedId);

    res.status(200).json({
      message: isLiked ? "Liked successfully" : "Already liked",
      liked: true,
      likedFeeds: result.likedFeeds,
    });
  } catch (err) {
    console.error("Error liking feed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- FEED SAVE ----------------------
exports.creatorsaveFeed = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;
  const feedId = req.body.feedId;

  if (!feedId) return res.status(400).json({ message: "feedId required" });
  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    const filter = { $or: [{ userId }, { accountId }] };
    const result = await UserFeedActions.findOneAndUpdate(
      filter,
      { $addToSet: { savedFeeds: feedId } },
      { upsert: true, new: true }
    );

    const isSaved = result.savedFeeds.includes(feedId);

    res.status(200).json({
      message: isSaved ? "Saved successfully" : "Already saved",
      saved: true,
      savedFeeds: result.savedFeeds,
    });
  } catch (err) {
    console.error("Error saving feed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- FEED DOWNLOAD ----------------------
exports.creatordownloadFeed = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;
  const feedId = req.body.feedId;

  if (!feedId) return res.status(400).json({ message: "feedId required" });
  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    const download = await UserFeedActions.create({
      userId,
      accountId,
      feedId,
      type: "download",
      downloadedAt: new Date(),
    });

    const feed = await Feed.findById(feedId).select("contentUrl fileUrl downloadUrl");
    if (!feed) return res.status(404).json({ message: "Feed not found" });

    res.status(201).json({
      message: "Download recorded successfully",
      action: download,
      downloadLink: feed.downloadUrl || feed.fileUrl || feed.contentUrl,
    });
  } catch (err) {
    console.error("Error downloading feed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- FEED SHARE ----------------------
exports.creatorshareFeed = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;
  const { feedId, shareChannel, shareTarget } = req.body;

  if (!feedId) return res.status(400).json({ message: "feedId required" });
  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    const filter = { $or: [{ userId }, { accountId }] };
    const result = await UserFeedActions.findOneAndUpdate(
      filter,
      {
        $push: {
          sharedFeeds: { feedId, shareChannel, shareTarget, sharedAt: new Date() },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Feed shared successfully",
      sharedFeeds: result.sharedFeeds,
    });
  } catch (err) {
    console.error("Error sharing feed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- COMMENT POST ----------------------
exports.creatorpostComment = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;
  const { feedId, commentText, parentCommentId } = req.body;

  if (!feedId) return res.status(400).json({ message: "feedId is required" });
  if (!commentText) return res.status(400).json({ message: "commentText is required" });
  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    if (parentCommentId) {
      const parentComment = await UserComment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(400).json({ message: "Parent comment not found" });
      }
    }

    const comment = await UserComment.create({
      userId,
      accountId,
      feedId,
      commentText,
      parentCommentId: parentCommentId || null,
    });

    res.status(201).json({
      message: "Comment posted successfully",
      comment,
    });
  } catch (err) {
    console.error("Error posting comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- VIEW POST ----------------------
exports.creatorpostView = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;
  const { feedId, watchDuration } = req.body;

  if (!feedId) return res.status(400).json({ message: "feedId is required" });

  try {
    const view = await UserView.create({
      userId,
      accountId,
      feedId,
      watchDuration: watchDuration || 0,
    });

    res.status(201).json({
      message: "View recorded successfully",
      view,
    });
  } catch (err) {
    console.error("Error recording view:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- COMMENT LIKE TOGGLE ----------------------
exports.creatorcommentLike = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;
  const { commentId } = req.body;

  if (!commentId) return res.status(400).json({ message: "commentId is required" });
  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    const filter = { commentId, ...(userId ? { userId } : { accountId }) };
    const existingLike = await CommentLike.findOne(filter);

    if (existingLike) {
      await CommentLike.deleteOne({ _id: existingLike._id });
      const likeCount = await CommentLike.countDocuments({ commentId });
      return res.status(200).json({
        message: "Comment unliked",
        liked: false,
        likeCount,
      });
    }

    await CommentLike.create({ userId, accountId, commentId });
    const likeCount = await CommentLike.countDocuments({ commentId });

    res.status(201).json({
      message: "Comment liked",
      liked: true,
      likeCount,
    });
  } catch (err) {
    console.error("Error toggling comment like:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ---------------------- GET SAVED FEEDS ----------------------
exports.creatorgetUserSavedFeeds = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;

  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    const filter = userId ? { userId } : { accountId };
    const userActions = await UserFeedActions.findOne(filter)
      .populate("savedFeeds", "contentUrl fileUrl downloadUrl type")
      .lean();

    if (!userActions || !userActions.savedFeeds.length) {
      return res.status(404).json({ message: "No saved feeds found" });
    }

    const savedFeedUrls = userActions.savedFeeds.map(feed => {
      const folder = feed.type === "video" ? "videos" : "images";
      return (
        feed.downloadUrl ||
        feed.fileUrl ||
        (feed.contentUrl
          ? `http://192.168.1.48:5000/uploads/${folder}/${path.basename(feed.contentUrl)}`
          : null)
      );
    }).filter(Boolean);

    res.status(200).json({
      message: "Saved feed URLs retrieved successfully",
      savedFeedUrls,
    });
  } catch (err) {
    console.error("Error fetching saved feeds:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- GET DOWNLOADED FEEDS ----------------------
exports.creatorgetUserDownloadedFeeds = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;

  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    const filter = userId ? { userId } : { accountId };
    const userActions = await UserFeedActions.findOne(filter)
      .populate("downloadedFeeds", "contentUrl fileUrl downloadUrl type")
      .lean();

    if (!userActions || !userActions.downloadedFeeds.length) {
      return res.status(404).json({ message: "No downloaded feeds found" });
    }

    const downloadedFeedUrls = userActions.downloadedFeeds.map(feed => {
      const folder = feed.type === "video" ? "videos" : "images";
      return (
        feed.downloadUrl ||
        feed.fileUrl ||
        (feed.contentUrl
          ? `http://192.168.1.48:5000/uploads/${folder}/${path.basename(feed.contentUrl)}`
          : null)
      );
    }).filter(Boolean);

    res.status(200).json({
      message: "Downloaded feed URLs retrieved successfully",
      downloadedFeedUrls,
    });
  } catch (err) {
    console.error("Error fetching downloaded feeds:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------- GET LIKED FEEDS ----------------------
exports.creatorgetUserLikedFeeds = async (req, res) => {
  const userId = req.Id || req.body.userId || null;
  const accountId = req.accountId || req.body.accountId || null;

  if (!userId && !accountId)
    return res.status(400).json({ message: "Either userId or accountId required" });

  try {
    const filter = userId ? { userId } : { accountId };
    const userActions = await UserFeedActions.findOne(filter)
      .populate("likedFeeds", "contentUrl fileUrl downloadUrl type")
      .lean();

    if (!userActions || !userActions.likedFeeds.length) {
      return res.status(404).json({ message: "No liked feeds found" });
    }

    const likedFeedUrls = userActions.likedFeeds.map(feed => {
      const folder = feed.type === "video" ? "videos" : "images";
      return (
        feed.downloadUrl ||
        feed.fileUrl ||
        (feed.contentUrl
          ? `http://192.168.1.48:5000/uploads/${folder}/${path.basename(feed.contentUrl)}`
          : null)
      );
    }).filter(Boolean);

    res.status(200).json({
      message: "Liked feed URLs retrieved successfully",
      likedFeedUrls,
    });
  } catch (err) {
    console.error("Error fetching liked feeds:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const UserComment = require("../models/userCommentModel");
const Reply = require("../models/userRepliesModel");
const CommentLike = require("../models/commentsLikeModel");
const { feedTimeCalculator } = require("../middlewares/feedTimeCalculator");
const ProfileSettings=require('../models/profileSettingModel');





exports.getCommentsByFeed = async (req, res) => {
  try {
    const { feedId } = req.body;
    const userId = req.Id || req.body.userId;

    if (!feedId) return res.status(400).json({ message: "Feed ID required" });

    // 1. Get top-level comments
    const comments = await UserComment.find({ feedId })
      .sort({ createdAt: -1 })
      .lean();

    if (!comments.length) {
      return res.status(200).json({ comments: [] });
    }

    const commentIds = comments.map(c => c._id);
    const userIds = comments.map(c => c.userId);

    // 2. Likes for comments
    const commentLikesAgg = await CommentLike.aggregate([
      { $match: { commentId: { $in: commentIds } } },
      { $group: { _id: "$commentId", count: { $sum: 1 } } }
    ]);
    const commentLikeMap = {};
    commentLikesAgg.forEach(l => { commentLikeMap[l._id.toString()] = l.count; });

    // 3. User liked which comments
    const userLikedComments = await CommentLike.find({
      userId,
      commentId: { $in: commentIds }
    }).select("commentId -_id").lean();
    const userLikedCommentIds = userLikedComments.map(c => c.commentId.toString());

    // 4. Replies count per comment
    const replyAgg = await Reply.aggregate([
      { $match: { commentId: { $in: commentIds } } },
      { $group: { _id: "$commentId", count: { $sum: 1 } } }
    ]);
    const replyCountMap = {};
    replyAgg.forEach(r => { replyCountMap[r._id.toString()] = r.count; });

    // 5. Fetch user profiles for all commenters
    const profiles = await ProfileSettings.find({ userId: { $in: userIds } })
      .select("userId userName profileAvatar")
      .lean();

    const profileMap = {};
    const host = `${req.protocol}://${req.get("host")}`;
    profiles.forEach(p => {
      profileMap[p.userId.toString()] = {
        username: p.userName,
        avatar: p.profileAvatar ? `${host}/${p.profileAvatar}` : null,
      };
    });

    // 6. Format response
    const formattedComments = comments.map(c => {
      const profile = profileMap[c.userId?.toString()] || {};
      return {
        commentId: c._id,
        commentText: c.commentText,
        likeCount: commentLikeMap[c._id.toString()] || 0,
        isLiked: userLikedCommentIds.includes(c._id.toString()),
        replyCount: replyCountMap[c._id.toString()] || 0,
        timeAgo: feedTimeCalculator(c.createdAt),
        username: profile.username || "Unknown User",
        avatar: profile.avatar,
      };
    });

    res.status(200).json({ comments: formattedComments });
  } catch (error) {
    console.error("Error in getCommentsByFeed:", error);
    res.status(500).json({ message: "Server error" });
  }
};





exports.getRepliesByComment = async (req, res) => {
  try {
    const { commentId } = req.body;
    const userId = req.Id || req.body.userId;

    if (!commentId) return res.status(400).json({ message: "Comment ID required" });

    // 1. Fetch replies for the given comment
    const replies = await Reply.find({ commentId })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    if (!replies.length) {
      return res.status(200).json({ replies: [] });
    }

    const replyIds = replies.map(r => r._id);
    const replyUserIds = replies.map(r => r.userId);

    // 2. Likes for replies
    const replyLikesAgg = await CommentLike.aggregate([
      { $match: { commentId: { $in: replyIds } } }, // assuming CommentLike also stores reply likes
      { $group: { _id: "$commentId", count: { $sum: 1 } } }
    ]);
    const replyLikeMap = {};
    replyLikesAgg.forEach(l => { replyLikeMap[l._id.toString()] = l.count; });

    // 3. User liked which replies
    const userLikedReplies = await CommentLike.find({
      userId,
      commentId: { $in: replyIds }
    }).select("commentId -_id").lean();
    const userLikedReplyIds = userLikedReplies.map(r => r.commentId.toString());

    // 4. Fetch profile details of all reply users
    const profiles = await ProfileSettings.find({ userId: { $in: replyUserIds } })
      .select("userId userName profileAvatar")
      .lean();

    const profileMap = {};
    const host = `${req.protocol}://${req.get("host")}`;
    profiles.forEach(p => {
      profileMap[p.userId.toString()] = {
        username: p.userName,
        avatar: p.profileAvatar ? `${host}/${p.profileAvatar}` : null,
      };
    });

    // 5. Format response
    const formattedReplies = replies.map(r => {
      const profile = profileMap[r.userId?.toString()] || {};
      return {
        replyId: r._id,
        replyText: r.replyText,
        likeCount: replyLikeMap[r._id.toString()] || 0,
        isLiked: userLikedReplyIds.includes(r._id.toString()),
        timeAgo: feedTimeCalculator(r.createdAt),
        username: profile.username || "Unknown User",
        avatar: profile.avatar,
      };
    });

    res.status(200).json({ replies: formattedReplies });
  } catch (error) {
    console.error("Error in getRepliesByComment:", error);
    res.status(500).json({ message: "Server error" });
  }
};


const Feed = require('../../models/feedModel');
const User = require('../../models/userModels/userModel');
const Creator = require('../../models/creatorModel');
const { feedTimeCalculator } = require('../../middlewares/feedTimeCalculator');
const UserFeedActions =require('../../models/userFeedInterSectionModel.js');
const fs = require('fs');
const path=require('path');
const Account =require("../../models/accountSchemaModel.js")
const Admin=require("../../models/adminModels/adminModel.js")
const mongoose = require("mongoose");
const UserComment = require("../../models/userModels/userCommentModel.js");
const UserView = require("../../models/userModels/userViewFeedsModel.js");
const CommentLike = require("../../models/userModels/commentsLikeModel.js");



exports.getAllFeeds = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId;
    const accountId = req.accountId || req.body.accountId || null;

    // Step 1: Fetch feeds with minimal fields
    const feeds = await Feed.find()
      .sort({ createdAt: -1 })
      .select("userId type contentUrl category createdAt createdByAccount roleRef")
      .lean();

    if (!feeds.length) return res.status(404).json({ message: "No feeds found" });

    const feedIds = feeds.map(f => f._id);

    // Step 2: Aggregate likes, shares, comments, downloads from UserFeedActions
    const interactionsAgg = await UserFeedActions.aggregate([
      { $match: { feedId: { $in: feedIds } } },
      { $project: { feedId: 1, likedFeeds: 1, savedFeeds: 1, sharedFeeds: 1, downloadedFeeds: 1 } }
    ]);

    const interactionMap = {};
    interactionsAgg.forEach(doc => {
      const fid = doc.feedId.toString();
      if (!interactionMap[fid]) interactionMap[fid] = { like: 0, share: 0, download: 0 };
      interactionMap[fid].like += doc.likedFeeds?.length || 0;
      interactionMap[fid].share += doc.sharedFeeds?.length || 0;
      interactionMap[fid].download += doc.downloadedFeeds?.length || 0;
    });

    // Step 3: Aggregate views from UserView
    const viewsAgg = await UserView.aggregate([
      { $match: { feedId: { $in: feedIds } } },
      { $group: { _id: "$feedId", count: { $sum: 1 } } }
    ]);
    const viewMap = {};
    viewsAgg.forEach(v => { viewMap[v._id.toString()] = v.count; });

    // Step 4: User actions for liked/saved feeds
    let userActionsFilter = accountId ? { accountId } : { userId };
    const userActions = await UserFeedActions.findOne(userActionsFilter).lean();
    const likedFeedIds = userActions?.likedFeeds?.map(f => f.toString()) || [];
    const savedFeedIds = userActions?.savedFeeds?.map(f => f.toString()) || [];

    // Step 5: Bulk fetch accounts, creators & admins
    const accountIds = feeds.filter(f => f.roleRef === "Account").map(f => f.createdByAccount).filter(Boolean);
    const creatorIds = feeds.filter(f => f.roleRef === "Creator").map(f => f.createdByAccount).filter(Boolean);
    const adminIds = feeds.filter(f => f.roleRef === "Admin").map(f => f.createdByAccount).filter(Boolean);
console.log(creatorIds)
    // Accounts
    const accounts = await Account.find({ _id: { $in: accountIds } })
      .populate({ path: "userId", select: "userName profileSettings", populate: { path: "profileSettings", select: "profileAvatar" } })
      .lean();
    const accountMap = {}; accounts.forEach(a => { accountMap[a._id.toString()] = a; });

    // Creators
    const creators = await Account.find({ _id: { $in: creatorIds } })
      .populate({ path: "userId", select: "userName profileSettings", populate: { path: "profileSettings", select: "profileAvatar" } })
      .lean();
    const creatorMap = {}; creators.forEach(c => { creatorMap[c._id.toString()] = c; });

    // Admins
    const admins = await Admin.find({ _id: { $in: adminIds } })
      .populate("profileSettings", "profileAvatar")
      .lean();
    const adminMap = {}; admins.forEach(a => { adminMap[a._id.toString()] = a; });

    // Step 6: Aggregate comments and likes
    const comments = await UserComment.find({ feedId: { $in: feedIds } }).lean();
    const commentIds = comments.map(c => c._id);
    const commentLikesAgg = await CommentLike.aggregate([
      { $match: { commentId: { $in: commentIds } } },
      { $group: { _id: "$commentId", count: { $sum: 1 } } }
    ]);
    const commentLikeMap = {};
    commentLikesAgg.forEach(l => { commentLikeMap[l._id.toString()] = l.count; });

    // Step 7: User liked comments
    const userLikedComments = await CommentLike.find({ userId, commentId: { $in: commentIds } })
      .select("commentId -_id")
      .lean();
    const userLikedCommentIds = userLikedComments.map(c => c.commentId.toString());

    // Step 8: Build comment map by feedId
    const commentMapByFeed = {};
    comments.forEach(c => {
      const feedKey = c.feedId.toString();
      if (!commentMapByFeed[feedKey]) commentMapByFeed[feedKey] = [];

      commentMapByFeed[feedKey].push({
        commentId: c._id,
        commentText: c.commentText,
        parentCommentId: c.parentCommentId || null,
        likeCount: commentLikeMap[c._id.toString()] || 0,
        isLiked: userLikedCommentIds.includes(c._id.toString()),
        timeAgo: feedTimeCalculator(c.createdAt),
        replies: c.replies?.map(r => ({
          userId: r.userId,
          accountId: r.accountId,
          commentText: r.commentText,
          timeAgo: feedTimeCalculator(r.createdAt)
        })) || []
      });
    });

    // Step 9: Build final feeds array
    const enrichedFeeds = feeds.map(feed => {
      let userName = "Unknown";
      let profileAvatar = "Unknown";

      if (feed.roleRef === "Account" && feed.createdByAccount) {
        const acc = accountMap[feed.createdByAccount.toString()];
        userName = acc?.userId?.userName || "Unknown";
        profileAvatar = acc?.userId?.profileSettings?.profileAvatar
          ? `http://192.168.1.48:5000/uploads/images/${path.basename(acc.userId.profileSettings.profileAvatar)}`
          : "Unknown";

      } else if (feed.roleRef === "Creator" && feed.createdByAccount) {
        const cre = creatorMap[feed.createdByAccount.toString()];
        userName = cre?.userId?.userName || "Unknown";
        profileAvatar = cre?.userId?.profileSettings?.profileAvatar
          ? `http://192.168.1.48:5000/uploads/images/${path.basename(cre.userId.profileSettings.profileAvatar)}`
          : "Unknown";

      } else if (feed.roleRef === "Admin" && feed.createdByAccount) {
        const adm = adminMap[feed.createdByAccount.toString()];
        userName = adm?.userName || "Admin";
        profileAvatar = adm?.profileSettings?.profileAvatar
          ? `http://192.168.1.48:5000/uploads/images/${path.basename(adm.profileSettings.profileAvatar)}`
          : "Unknown";
      }

      const folder = feed.type === "video" ? "videos" : "images";
      const contentUrlFull = feed.contentUrl
        ? `http://192.168.1.48:5000/uploads/${folder}/${path.basename(feed.contentUrl)}`
        : null;

      return {
        feedId: feed._id,
        userName,
        profileAvatar,
        timeAgo: feedTimeCalculator(feed.createdAt),
        contentUrl: contentUrlFull,
        likesCount: interactionMap[feed._id.toString()]?.like || 0,
        shareCount: interactionMap[feed._id.toString()]?.share || 0,
        downloadsCount: interactionMap[feed._id.toString()]?.download || 0,
        viewsCount: viewMap[feed._id.toString()] || 0,
        commentsCount: commentMapByFeed[feed._id.toString()]?.length || 0,
        isLiked: likedFeedIds.includes(feed._id.toString()),
        isSaved: savedFeedIds.includes(feed._id.toString()),
        comments: commentMapByFeed[feed._id.toString()] || []
      };
    });

    res.status(200).json({ message: "Feeds retrieved successfully", feeds: enrichedFeeds });
  } catch (error) {
    console.error("Error in getAllFeeds:", error);
    res.status(500).json({ message: "Server error" });
  }
};











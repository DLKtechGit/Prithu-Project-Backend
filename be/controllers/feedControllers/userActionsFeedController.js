const UserFeedActionInteraction = require("../../models/userFeedInterSectionModel.js");
const Comment = require("../../models/userCommandModel.js");
const Feeds = require("../../models/feedModel.js");
const { getActiveUserAccount } = require('../../middlewares/creatorAccountactiveStatus.js');

exports.likeFeed = async (req, res) => {
  const { accountId, feedId } = req.body;

  const activeAccount = await getActiveUserAccount(accountId);
  if (!activeAccount) {
    return res.status(403).json({ message: "Active User Account required to perform this action" });
  }

  try {
    const like = await UserFeedActionInteraction.create({
      accountId,
      feedId,
      type: "like",
    });
    res.status(201).json(like);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "Already liked this feed" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.saveFeed = async (req, res) => {
  const { accountId, feedId } = req.body;

  const activeAccount = await getActiveUserAccount(accountId);
  if (!activeAccount) return res.status(403).json({ message: "Active User Account required" });

  try {
    const save = await UserFeedActionInteraction.create({
      accountId,
      feedId,
      type: "save",
    });
    res.status(201).json(save);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "Already saved this feed" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.downloadFeed = async (req, res) => {
  const { accountId, feedId } = req.body;

  const activeAccount = await getActiveUserAccount(accountId);
  if (!activeAccount) return res.status(403).json({ message: "Active User Account required" });

  try {
    const download = await UserFeedActionInteraction.findOneAndUpdate(
      { accountId, feedId, type: "download" },
      { $setOnInsert: { createdAt: new Date() }, $set: { lastDownloadedAt: new Date() } },
      { upsert: true, new: true }
    );

    const feed = await Feeds.findById(feedId).select("contentUrl fileUrl downloadUrl");
    if (!feed) return res.status(404).json({ message: "Feed not found" });

    res.status(201).json({
      message: "Download recorded successfully",
      action: download,
      downloadLink: feed.downloadUrl || feed.fileUrl || feed.contentUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.shareFeed = async (req, res) => {
  const { accountId, feedId } = req.body;

  const activeAccount = await getActiveUserAccount(accountId);
  if (!activeAccount) return res.status(403).json({ message: "Active User Account required" });

  try {
    const share = await UserFeedActionInteraction.create({
      accountId,
      feedId,
      type: "share",
    });
    res.status(201).json(share);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "Already shared this feed" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
};

exports.getUserSavedFeeds = async (req, res) => {
  const { accountId } = req.body;

  const activeAccount = await getActiveUserAccount(accountId);
  if (!activeAccount) return res.status(403).json({ message: "Active User Account required" });

  try {
    const savedFeeds = await UserFeedActionInteraction.find({
      accountId,
      type: "save"
    }).populate("feedId");

    res.status(200).json(savedFeeds);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserDownloadedFeeds = async (req, res) => {
  const { accountId } = req.body;

  const activeAccount = await getActiveUserAccount(accountId);
  if (!activeAccount) return res.status(403).json({ message: "Active User Account required" });

  try {
    const downloadedFeeds = await UserFeedActionInteraction.find({
      accountId,
      type: "download"
    }).populate("feedId");

    res.status(200).json(downloadedFeeds);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addComment = async (req, res) => {
  const { accountId, feedId, text } = req.body;

  const activeAccount = await getActiveUserAccount(accountId);
  if (!activeAccount) return res.status(403).json({ message: "Active User Account required" });

  try {
    const comment = await Comment.create({
      accountId,
      feedId,
      text,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

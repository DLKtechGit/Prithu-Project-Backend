const UserFeedActionInteraction =require("../../models/userActionIntersectionModel.js");
const Comment =require("../../models/userCommandModel.js");
const Feeds =require("../../models/feedModel.js");

exports.likeFeed = async (req,res) => {

  const { userId, feedId } = req.body;

  try {
    const like = await UserFeedActionInteraction.create({
      userId,
      feedId,
      type: "like",
    });
    res.status(201).json(like);

  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "User already liked this feed" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}


exports.saveFeed = async (req, res) => {
  const { userId, feedId } = req.body;

  try {
    const save = await UserFeedActionInteraction.create({
      userId,
      feedId,
      type: "save",
    });
    res.status(201).json(save);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "User already saved this feed" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}




exports.downloadFeed = async (req, res) => {
  const { userId, feedId } = req.body;

  try {
    // 1️⃣ Record the download action
   const download = await UserFeedActionInteraction.findOneAndUpdate(
  { userId, feedId, type: "download" },
  { 
    $setOnInsert: { createdAt: new Date() },  // only set if new
    $set: { lastDownloadedAt: new Date() }    // track latest download
  },
  { upsert: true, new: true }
);


    // 2️⃣ Get the feed details (to fetch the actual file link)
    const feed = await Feeds.findById(feedId).select("contentUrl fileUrl downloadUrl");
    console.log(feed)
    if (!feed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    // 3️⃣ Send back download link with action record
    res.status(201).json({
      message: "Download recorded successfully",
      action: download,
      downloadLink: feed.downloadUrl || feed.fileUrl || feed.contentUrl,
    });

  } catch (err) {
    console.error(err);

    if (err.code === 11000) {
      // Duplicate download (unique index triggered)
      const feed = await Feeds.findById(feedId).select("contentUrl fileUrl downloadUrl");
      return res.status(200).json({
        message: "User already downloaded this feed",
        downloadLink: feed?.downloadUrl || feed?.fileUrl || feed?.contentUrl,
      });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};



exports.shareFeed = async (req, res) => {
  const { userId, feedId, channel} = req.body;

  try {
    const share = await UserFeedActionInteraction.create({
      userId,
      feedId,
      type: "share",
      shareChannel: channel, // e.g. "whatsapp"
    });
    res.status(201).json(share);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ message: "User already shared this feed" });
    } else {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}


exports.getUserSavedFeeds = async (req, res) => {
  const { userId } = req.params.id;

  try {
    const savedFeeds = await UserFeedActionInteraction.find({
      userId,
      type: "save"
    }).populate("feedId");

    res.status(200).json(savedFeeds);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getUserDownloadedFeeds = async (req, res) => {
  const { userId } = req.params.id;

  try {
    const downloadedFeeds = await UserFeedActionInteraction.find({
      userId,
      type: "download"
    }).populate("feedId");

    res.status(200).json(downloadedFeeds);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.addComment = async (req, res) => {
  const { userId, feedId, text } = req.body;

  try {
    const comment = await Comment.create({
      userId,
      feedId,
      text,
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

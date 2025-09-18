const UserWatchStats = require("../../models/userModels/userWatchesDurationSchema");
const WatchSession = require("../../models/userModels/userVideoWatchSessionSchema");
const Feed = require("../../models/feedModel");
const ImageView = require("../../models/userModels/MediaSchema/userImageViewsModel");
const ImageStats = require("../../models/userModels/MediaSchema/imageViewModel");


// POST /watch/session
exports.userWatchingSession = async (req, res) => {
  try {
    const { feedId, watchedSeconds } = req.body;
    const userId = req.Id || req.body.userId;

    if (!userId || !feedId || !watchedSeconds) {
      return res.status(400).json({ message: "userId, feedId, and watchedSeconds are required" });
    }

    // 1️⃣ Check feed type (must be video)
    const feed = await Feed.findById(feedId, "type title duration");
    if (!feed || feed.type !== "video") {
      return; // ❌ Not a video → exit silently
    }

    // 2️⃣ Prevent duplicate session (same user + same feed + same watchedSeconds)
    const alreadyExists = await WatchSession.findOne({ userId, feedId, watchedSeconds });
    if (alreadyExists) {
      return; // ❌ Already recorded → exit silently
    }

    // 3️⃣ Save detailed session
    await WatchSession.create({ userId, feedId, watchedSeconds });

    // 4️⃣ Update aggregated stats
    await UserWatchStats.updateOne(
      { userId },
      {
        $inc: {
          totalSeconds: watchedSeconds,
          sessionsCount: 1,
          [`feeds.${feedId}.watchedSeconds`]: watchedSeconds,
          [`feeds.${feedId}.sessions`]: 1,
        },
        $set: {
          [`feeds.${feedId}.lastWatched`]: new Date(),
          lastUpdated: new Date(),
        },
      },
      { upsert: true }
    );

    // 5️⃣ Minimal response (no extra data)
    return res.json({ message: "Watch session recorded" });
  } catch (err) {
    console.error("❌ userWatchingSession error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};





exports.userImageViewCount = async (req, res) => {
  try {
    const { feedId } = req.body;
    const userId = req.Id || req.body.userId;

    if (!userId || !feedId) {
      return res.status(400).json({ message: "userId and feedId are required" });
    }

    // 1️⃣ Check feed type
    const feed = await Feed.findById(feedId, "type");
    if (!feed || feed.type !== "image") {
      return; 
    }

    // 2️⃣ Check if this user has already viewed this feed
    const existing = await ImageView.findOne({
      userId,
      "views.imageId": feedId,
    });

    if (existing) {
      return; 
    }

    // 3️⃣ Push new feedId + timestamp into views array
    await ImageView.findOneAndUpdate(
      { userId },
      { $push: { views: { imageId: feedId, viewedAt: new Date() } } },
      { upsert: true }
    );

    // 4️⃣ Update aggregated stats
    await ImageStats.findOneAndUpdate(
      { imageId: feedId },
      {
        $inc: { totalViews: 1 },
        $set: { lastViewed: new Date() },
      },
      { upsert: true }
    );

    // 5️⃣ Minimal response
    return res.json({ message: "Image view recorded" });
  } catch (err) {
    console.error("❌ Error recording image view:", err);
    return res.status(500).json({ message: "Server error" });
  }
};




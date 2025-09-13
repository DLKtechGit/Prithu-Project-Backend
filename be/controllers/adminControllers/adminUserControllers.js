const Users = require("../../models/userModels/userModel.js");
const makePresenceService = require("../../services/presenseService.js");
const { initRedis } = require("../../radisClient/intialRadis.js");
const {userTimeAgo}=require('../../middlewares/userStatusTimeAgo.js');
const UserFeedActions=require('../../models/userFeedInterSectionModel');
const Account=require('../../models/accountSchemaModel');
const ProfileSettings=require('../../models/profileSettingModel.js');
const path=require('path')
const mongoose=require("mongoose");
const Device = require("../../models/userModels/userSession-Device/deviceModel");


let redisClient;
async function getRedis() {
  if (!redisClient) redisClient = await initRedis();
  return redisClient;
}

// Initialize presenceService after Redis is ready
async function getPresenceService() {
  const client = await getRedis();
  return makePresenceService(client, User, { to: () => {} });
}

// Get single user detail
exports.getUserProfileDetail = async (req, res) => {
  try {
    const {userId }=req.body; // from auth middleware

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // ✅ Run queries in parallel
    const [user, profile, languages] = await Promise.all([
      User.findById(userId).select("userName email").lean(),
      Profile.findOne({ userId }).lean(),
      UserLanguage.find({ userId, active: true }).select("appLanguageCode feedLanguageCode").lean()
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        profile,
        languages
      }
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch user profile",
      error: err.message
    });
  }
};

// Get user status with devices
exports.getUserStatus = async (req, res) => {
  
  try {
    const client = await getRedis();
  
    const users = await User.find({}, "_id name role").lean();
    
    const result = [];

    for (const user of users) {
      const lastSeen = await client.get(`lastseen:${user._id}`);
      console.log(lastSeen)
      const sockets = await client.sMembers(`user:sockets:${user._id}`);

      // get devices
      const devices = [];
      for (const s of sockets) {
        const d = await client.hGetAll(`user:device:${user._id}:${s}`);
        if (Object.keys(d).length > 0) devices.push(d);
      }

      result.push({
        ...user,
        status: sockets.length > 0 ? "online" : "offline",
        lastSeen: sockets.length > 0 ? "now" : lastSeen ?userTimeAgo(lastSeen) : "unknown",
        devices,
      });
    }

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};


exports.getUsersByDate = async (req, res) => {
  try {
    const { date, type = "created" } = req.query; 
    // type = "created" (default) or "updated"

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Create start & end range for the day
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // Choose filter field dynamically
    const filterField = type === "updated" ? "updatedAt" : "createdAt";

    // ✅ Query only required fields + populate
    const users = await Users.find(
      { [filterField]: { $gte: start, $lte: end } },
      "userName email profileSettings createdAt updatedAt" // projection
    )
      .populate("profileSettings") // one populate instead of multiple queries
      .lean(); // return plain JS objects (faster, less memory)

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found for this date" });
    }

    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users by date:", err);
    res.status(500).json({ message: "Cannot fetch user details", error: err.message });
  }
};


exports.getAllUserDetails = async (req, res) => {
  try {
    const allUsers = await Users.find()
      .select("userName email isActive profileSettings") // only take userName + email from User
      .populate("profileSettings");             // full profile details

    if (!allUsers || allUsers.length === 0) {
      return res.status(404).json({ message: "Users details not found" });
    }

    res.status(200).json({ allUsers });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Cannot fetch user details", error: err.message });
  }
};




exports.getAnaliticalCountforUser = async (req, res) => {
  try {
    let userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    userId = userId.trim();

    const objectId = new mongoose.Types.ObjectId(userId);

    // 🔹 Fetch the UserActions doc for this user
    const userAction = await mongoose.connection
      .collection("UserFeedActions")
      .findOne({ userId: objectId });

    // 🔹 Count comments from UserComments
    const commentCount = await mongoose.connection
      .collection("UserComments")
      .countDocuments({ userId: objectId });

    // 🔹 Build response (count based on new object-array structure)
    const result = {
      likes: userAction?.likedFeeds?.length || 0,
      saves: userAction?.savedFeeds?.length || 0,
      shares: userAction?.sharedFeeds?.length || 0,
      downloads: userAction?.downloadedFeeds?.length || 0,
      comments: commentCount || 0,
    };

    res.status(200).json({
      message: "Analytical count fetched successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error fetching analytical counts:", err);
    res.status(500).json({
      message: "Error fetching analytical counts",
      error: err.message,
    });
  }
};



exports.getUserLikedFeedsforAdmin = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const userLikedFeeds = await UserFeedActions.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$likedFeeds" },
      // Lookup feed details
      {
        $lookup: {
          from: "Feeds",
          localField: "likedFeeds.feedId",
          foreignField: "_id",
          as: "feedInfo"
        }
      },
      { $unwind: "$feedInfo" },
      // Lookup creator account
      {
        $lookup: {
          from: "Accounts",
          localField: "feedInfo.createdByAccount",
          foreignField: "_id",
          as: "creatorAccount"
        }
      },
      { $unwind: { path: "$creatorAccount", preserveNullAndEmptyArrays: true } },
      // Lookup creator profile
      {
        $lookup: {
          from: "ProfileSettings",
          localField: "creatorAccount.userId",
          foreignField: "userId",
          as: "creatorProfile"
        }
      },
      { $unwind: { path: "$creatorProfile", preserveNullAndEmptyArrays: true } },
      // Project final fields (no host)
      {
        $project: {
          _id: 0,
          likedAt: "$likedFeeds.likedAt",
          contentUrl: "$feedInfo.contentUrl",
          feedInfo: {
            feedId: "$feedInfo._id",
            type: "$feedInfo.type",
            language: "$feedInfo.language",
            category: "$feedInfo.category",
            createdAt: "$feedInfo.createdAt",
            createdBy: {
              userName: { $ifNull: ["$creatorProfile.userName", "Unknown"] },
              profileAvatar: "$creatorProfile.profileAvatar"
            }
          }
        }
      }
    ]);

    res.status(200).json({
      message: "User liked feeds fetched successfully",
      count: userLikedFeeds.length,
      data: userLikedFeeds
    });
  } catch (err) {
    console.error("Error fetching user liked feeds:", err);
    res.status(500).json({
      message: "Error fetching user liked feeds",
      error: err.message
    });
  }
};





exports.getUsersStatus = async (req, res) => {
  try {
    // 1️⃣ Fetch users with required fields
    const users = await Users.find({}, "username email isOnline lastSeenAt").lean();

    if (!users.length) {
      return res.json({ totalOnline: 0, totalOffline: 0, users: [] });
    }

    // 2️⃣ Get devices in a single query (only needed fields)
    const userIds = users.map((u) => u._id);
    const devices = await Device.find(
      { userId: { $in: userIds } },
      "userId deviceId deviceType ipAddress lastActiveAt"
    ).lean();

    // 3️⃣ Group devices by userId
    const devicesByUser = devices.reduce((acc, d) => {
      const id = d.userId.toString();
      if (!acc[id]) acc[id] = [];
      acc[id].push({
        deviceId: d.deviceId,
        deviceType: d.deviceType,
        ipAddress: d.ipAddress,
        lastActiveAt: d.lastActiveAt,
      });
      return acc;
    }, {});

    // 4️⃣ Build result + online/offline count
    let totalOnline = 0;
    let totalOffline = 0;

    const result = users.map((user) => {
      if (user.isOnline) totalOnline++;
      else totalOffline++;

      const userDevices = devicesByUser[user._id.toString()] || [];

      return {
        ...user,
        deviceCount: userDevices.length,
        devices: userDevices,
      };
    });

    // 5️⃣ Final response
    res.json({
      totalOnline,
      totalOffline,
      totalUsers: users.length,
      users: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





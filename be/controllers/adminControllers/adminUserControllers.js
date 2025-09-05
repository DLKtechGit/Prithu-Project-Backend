const User = require("../../models/userModels/userModel.js");
const makePresenceService = require("../../services/presenseService.js");
const { initRedis } = require("../../radisClient/intialRadis.js");
const {userTimeAgo}=require('../../middlewares/userStatusTimeAgo.js')



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

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
  
    const presenceService = await getPresenceService();
    const users = await User.find({}, "-passwordHash").lean();
    const onlineIds = new Set(await presenceService.listOnlineUsers());
    const mapped = users.map((u) => ({
      ...u,
      isOnline: onlineIds.has(u._id.toString()),
      lastSeenAt: u.lastSeenAt,
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "err" });
  }
};

// Get single user detail
exports.getUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;
    const presenceService = await getPresenceService();

    const user = await User.findById(userId, "-passwordHash").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const onlineIds = new Set(await presenceService.listOnlineUsers());
    user.isOnline = onlineIds.has(user._id.toString());
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "err" });
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

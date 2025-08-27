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

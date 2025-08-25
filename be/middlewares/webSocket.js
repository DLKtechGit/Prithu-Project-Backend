const {Server} = require("socket.io");
const User = require("../models/userModels/userModel");

let io;

exports.initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
      credentials: true,
    },
  });

  // Middleware for authenticating sockets using sessionId from handshake auth
  io.use(async (socket, next) => {
    try {
      const sessionId = socket.handshake.auth?.sessionId;
      if (!sessionId) {
        return next(new Error("No sessionId provided"));
      }
      const user = await User.findOne({ activeSession: sessionId });
      if (!user) {
        return next(new Error("Invalid session"));
      }
      socket.userId = user._id.toString();
      socket.join(`user:${socket.userId}`); // Join personal room
      next();
    } catch (error) {
      console.error("Socket auth error:", error);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    try {
      await User.findByIdAndUpdate(socket.userId, { isOnline: true, lastSeen: new Date() });
    } catch (error) {
      console.error(`Error setting user (${socket.userId}) online:`, error);
    }

    // Heartbeat event to keep user online status updated
    socket.on("heartbeat", async () => {
      try {
        await User.findByIdAndUpdate(socket.userId, { isOnline: true, lastSeen: new Date() });
      } catch (error) {
        console.error(`Error updating heartbeat for user (${socket.userId}):`, error);
      }
    });

    // On user disconnect, mark as offline and update last seen
    socket.on("disconnect", async () => {
      try {
        await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
      } catch (error) {
        console.error(`Error setting user (${socket.userId}) offline:`, error);
      }
    });
  });
};

exports.socketIO = () => io;

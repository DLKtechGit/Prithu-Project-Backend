const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
  feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feeds', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Command content or type (optional, e.g., a note or command type)
  commandText: { type: String, default: '' },

  // Timestamp of command creation
  createdAt: { type: Date, default: Date.now },
});

commandSchema.index({ feedId: 1, userId: 1 }, { unique: true }); // one command per user per feed

module.exports = mongoose.model('Command', commandSchema);

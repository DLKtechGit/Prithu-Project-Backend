const mongoose = require('mongoose');

const feedSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['image', 'video'], 
    required: true 
  },

  language: { 
    type: String, 
    required: true 
  },

  category: { type: String, required: true },

  createdByAccount: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',   // ✅ must match Account model name
    required: true
  },

  contentUrl: { type: String, required: true },

  // Timestamp of creation
  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  
  // duration: { type: Number, default: 0 },
  // totalWatchTime: { type: Number, default: 0 },
  // maxWatchHours: { type: Number, default: null },
  // likesCount: { type: Number, default: 0 },
  // shareCount: { type: Number, default: 0 },
  // downloadsCount: { type: Number, default: 0 },

  // commandedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // scheduledAt: { type: Date },
  // isPosted: { type: Boolean, default: false },

  // viewedBy: [{
  //   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  //   viewedAt: { type: Date, default: Date.now },
  //   watchTime: { type: Number, default: 0 }
  // }]
});

// // Indexes
// feedsSchema.index({ 'viewedBy.userId': 1 });
// feedsSchema.index({ duration: 1 });
// feedsSchema.index({ totalWatchTime: 1 });

module.exports = mongoose.model('Feed', feedSchema, 'Feeds');

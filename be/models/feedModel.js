const mongoose = require('mongoose');

const feedsSchema = new mongoose.Schema({
  // Content type, required: image, video, or text
  type: { 
    type: String, 
    enum: ['image', 'video', 'text'], 
    required: true 
  },

  // Language of the content
  language: { 
    type: String, 
    required: true 
  },

  // Tags for searching/categorization
  tags: [String],

  // Content URL (for image, video)
  contentUrl: String,

  // Text content (for text feeds)
  text: String,

  // Author reference
  createdBy: { // preserved original naming
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  // Timestamp of creation
  createdAt: { 
    type: Date, 
    default: Date.now,
  },

  // Category of feed (required)
  category: {
    type: String,
    required: true,
  },

  // Duration in seconds (for video/audios)
  duration: { 
    type: Number, 
    default: 0 
  },

  // Total watch time accumulated across users
  totalWatchTime: { 
    type: Number, 
    default: 0 
  },

  // Max allowed watch hours (if applicable)
  maxWatchHours: { 
    type: Number, 
    default: null 
  }, 

  // Like, share, download counts
  likesCount: { 
    type: Number, 
    default: 0 
  },
  shareCount: {
    type: Number,
    default: 0,
  },
  downloadsCount: { 
    type: Number, 
    default: 0 
  },
commandedByUsers: [
  { type: mongoose.Schema.Types.ObjectId,
     ref: 'User'
     }],



  // Array of views by users with timestamps and watch duration per user
  viewedBy: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    viewedAt: { 
      type: Date, 
      default: Date.now 
    },
    watchTime: { 
      type: Number, 
      default: 0 
    } 
  }],
});

// Indexes for performance optimization
feedsSchema.index({ 'viewedBy.userId': 1 });
feedsSchema.index({ duration: 1 });
feedsSchema.index({ totalWatchTime: 1 });

module.exports = mongoose.model('Feeds', feedsSchema, 'Feeds');

const mongoose = require('mongoose');

const feedsSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['image', 'video', 'text'], 
    required: true 
  },
  language: { 
    type: String, 
    required: true 
  },
  tags: [String],
  contentUrl: String,
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  category: {  
    type: String, 
    required: true
  },

  duration: { 
    type: Number, 
    default: 0 
  },
  totalWatchTime: { 
    type: Number, 
    default: 0 
  }, 
  maxWatchHours: { 
    type: Number, 
    default: null 
  }, 

  likesCount: { 
    type: Number, 
    default: 0 
  },
  downloadsCount: { 
    type: Number, 
    default: 0 
  },

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
  }]
});

// Indexes 
feedsSchema.index({ 'viewedBy.userId': 1 });
feedsSchema.index({ duration: 1 });
feedsSchema.index({ totalWatchTime: 1 });

module.exports = mongoose.model('Feeds', feedsSchema ,'Feeds');

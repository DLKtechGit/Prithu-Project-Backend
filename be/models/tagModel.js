const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  feedIds:[{type:mongoose.Schema.Types.ObjectId,ref:'Feeds'}],

  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Tag', tagSchema, 'Tags');

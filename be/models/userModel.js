const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },

  referralCode: {
    type: String,
    unique: true,
    index: true,
  },

  referredByCode: {
    type: String, 
  },

  referredByUserId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
  },

  referralcount:{type:Number,default:0},

  referredPeople:[{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null}],

  websiteLanguage: { type: String, default: 'en' },
  feedLanguage: { type: String, default: 'en' },
  interests: { type: [String], default: [] },

  likedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],
  downloadedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],

  profileSettings: {
    displayName: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '' },
  },
  role:{type:String,enum:['admin','creator','user','business'],default:'user'},

  // Creator following 
  followingCreators: [{
    creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Creator' },
    followedAt: { type: Date, default: Date.now }
  }],
  
  totalFollowingCreators: {
    type: Number,
    default: 0
  },

  isActive: { type: Boolean, default: true },

  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },

  otpCode: { type: String },
  otpExpiresAt: { type: Date },

  //Feeds Views

  viewedFeeds:[{type:mongoose.Schema.Types.ObjectId,ref:'Feeds'}],

  totalFeedsWatchDuration:{type:Number,default:0}

}, { timestamps: true });

module.exports = mongoose.model('User', usersSchema,'User');

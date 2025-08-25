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

  referralCodeUsageLimt:{type:Number,default:2},

  referralCodeIsValid:{type:Boolean,default:true},

  referredByUserId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null,
  },

  referralcount:{type:Number,default:0},

  referredPeople:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],

  websiteLanguage: { type: String, default: 'en' },
  feedLanguage: { type: String, default: 'en' },
  interests: { type: [String], default: [] },

  likedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],
  downloadedFeeds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],

  profileSettings:[{ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfiles' }],

  
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

  totalFeedsWatchDuration:{type:Number,default:0},
  
//Term and Condition 
  termsAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  termsAcceptedAt: {
    type: Date,
  },

}, { timestamps: true });

module.exports = mongoose.model('User', usersSchema,'User');



// // models/User.js
// import mongoose from "mongoose";
// const UserSchema = new mongoose.Schema({
//   username: { type: String, unique: true },
//   password: String,
//   role: { type: String, enum: ["user", "admin"], default: "user" },
//   activeSession: { type: String, default: null }, // single-device
//   isOnline: { type: Boolean, default: false },
//   lastSeen: { type: Date, default: null },
//   fcmTokens: [String],
// });
// export default mongoose.model("User", UserSchema);



// // models/User.js
// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
//   role: { type: String, default: "user" },

//   fcmTokens: { type: [String], default: [] },

//   // Optional: users that this user follows (for creator follow system)
//   following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Creator" }],

//   // Optional: users who follow this user (if user can be a creator)
//   followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
// });




// export default mongoose.model("User", UserSchema);


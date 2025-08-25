const mongoose = require('mongoose');

const ProfileSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'roleRef', // dynamic reference field
      index: true,
    },
    roleRef: {
      type: String,
      required: true,
      enum: ['User', 'Business', 'Creator', 'Admin'], // exact model names referenced
    },
    dateOfBirth: { type: Date,},         // corrected casing and default null
    maritalStatus: { type: String },     // boolean default should be null or false
    displayName: { type: String,},
    bio: { type: String,},
    phoneNumber: { type: String,},
    profileAvatar: { type: String, },
    role: {
      type: String,
      enum: ['creator', 'business', 'consumer', 'admin'],
      required: true,
    },
    theme: { type: String, default: 'light' },           // 'light' or 'dark'
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    privacy: {
      showEmail: { type: Boolean, default: false },
      showProfilePicture: { type: Boolean, default: true },
    },
    language: { type: String, default: 'en' },            // default language code
    timezone: { type: String, default: 'Asia/Kolkata' }, // default timezone
    details: { type: mongoose.Schema.Types.Mixed },      // flexible role-specific details
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProfileSettings', ProfileSettingsSchema, 'ProfilesSettings');

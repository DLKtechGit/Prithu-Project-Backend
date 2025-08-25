const mongoose = require('mongoose');

const ProfileSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'roleRef',        // dynamic reference field
      index: true,
    },
    roleRef: {
      type: String,
      required: true,
      enum: ['User', 'Business', 'Creator', 'Admin'],  // the exact model names you will reference
    },

    displayName: { type: String, default: "Not Available" },
    bio: { type: String, default: "Not Available" },
    phoneNumber: { type: String, default: "Not Available" },
    profileAvatar: { type: String, default: "Not Available" },
    role: { type: String, enum: ["creator", "business", "consumer", "admin"], required: true }, 
    theme: { type: String, default: 'light' },        // e.g. 'light' or 'dark'
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
    },
    privacy: {
      showEmail: { type: Boolean, default: false },
      showProfilePicture: { type: Boolean, default: true },
    },
    language: { type: String, default: 'en' },         // default language
    timezone: { type: String, default: 'Asia/Kolkata' }, // default timezone
    details: { type: mongoose.Schema.Types.Mixed },    // flexible role-specific details
  },
  {
    timestamps: true,    
  }
);

module.exports = mongoose.model('ProfileSettings', ProfileSettingsSchema, 'ProfilesSettings');

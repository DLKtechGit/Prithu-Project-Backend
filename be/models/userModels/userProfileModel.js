const mongoose=require('mongoose')

const ProfileSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio:{type:String},
  mobileNumber:{type:String},
  profileAvatar:{type:String},
  theme: { type: String, default: 'light' }, // e.g., 'light' or 'dark'
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  privacy: {
    showEmail: { type: Boolean, default: false },
    showProfilePicture: { type: Boolean, default: true }
  },
  language: { type: String, default: 'en' }, // default language
  timezone: { type: String, default: 'Asia/Kolkata' }, // default timezone
  // Additional customizable settings...
},
{
  timestamps: true // for createdAt, updatedAt
});

module.exports = mongoose.model('UserProfiles', ProfileSettingsSchema, 'UserProfiles');

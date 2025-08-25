import mongoose from "mongoose";

const UserDeviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'roleRef',        // dynamic reference field that tells Mongoose which model to populate
    index: true,
  },
  roleRef: {
    type: String,
    required: true,
    enum: ['User', 'Business', 'Creator', 'Admin'],  // exact model names for referenced collections
  },
  deviceName: String,                     // friendly name, optional
  deviceType: String,                     // e.g., mobile/desktop/tablet
  os: String,                            // e.g., Windows 11, Android 14, iOS 17
  browser: String,                       // e.g., Chrome, Safari
  brand: String,                        // e.g., Samsung/Apple/etc
  model: String,                        // e.g., iPhone 13, SM-G991B
  ip: String,                          // IP address
  locationHint: String,                 // to store location hint like city or country
  role: { type: String, enum: ["creator", "business", "consumer", "admin"], required: true }, 
  lastLoginAt: { type: Date, default: Date.now },
}, {
  timestamps: true                     // adds createdAt and updatedAt timestamps automatically
});

export default mongoose.model("UserDevice", UserDeviceSchema);

const { body, validationResult } = require('express-validator');
const Profile = require('../../models/profileSettingModel');
const User=require('../../models/userModels/userModel');
const Creator=require('../../models/creatorModel');
const Admin = require('../../models/adminModels/adminModel');
const Business=require('../../models/businessModel');
const path = require("path");


// Validation middleware
exports.validateUserProfileUpdate = [
  body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('bio').optional().isString(),
  body('maritalStatus').optional().isString(),
  body('dateOfBirth').optional().isISO8601().toDate(),
  body('profileAvatar').optional().isString(),
  body('userName').optional().isString(),
  body('displayName').optional().isString(),
  body('role').optional().isIn(['creator', 'business', 'user']),
  body('theme').optional().isIn(['light', 'dark']),
  body('language').optional().isString(),
  body('timezone').optional().isString(),
  body('details').optional(),
  body('notifications').optional().isObject(),
  body('privacy').optional().isObject(),
];

// Update profile controller
exports.userProfileDetailUpdate = async (req, res) => {
  try {
    const { accountId } = req.body;
    if (!accountId) {
      return res.status(400).json({ message: "accountId is required" });
    }

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    const allowedFields = [
      'phoneNumber','bio','userName','displayName','dateOfBirth','maritalStatus',
      'role','theme','language','timezone','details','notifications','privacy'
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    // Handle profile avatar file if uploaded
    if (req.file?.path) {
      const newFileName = path.basename(req.file.path);
      const existingProfile = await Profile.findOne({ accountId });
      if (!existingProfile || path.basename(existingProfile.profileAvatar || '') !== newFileName) {
        updateData.profileAvatar = req.file.path;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // Update or create profile for the account
    const updatedProfile = await Profile.findOneAndUpdate(
      { accountId },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate({
      path: 'accountId',
      populate: { path: 'userId', select: 'userName email' }
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });

  } catch (error) {
    console.error("Error in userProfileDetailUpdate:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// Fetch profile by account ID
exports.profileDetailWithAccountId = async (req, res) => {
  try {
    const { accountId } = req.params;
    if (!accountId) return res.status(400).json({ message: "accountId is required" });

    const profile = await Profile.findOne({ accountId })
      .populate({ path: 'accountId', populate: { path: 'userId', select: 'userName email' } });

    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    return res.status(200).json({
      profileSetting: profile,
      userName: profile.accountId?.userId?.userName || "Unknown User",
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

 


const { body, validationResult } = require('express-validator');
const Profile = require('../../models/profileSettingModel');
const path = require("path");
const User = require('../../models/userModels/userModel');
const Account=require("../../models/accountSchemaModel");



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
    const { userId, accountId, userName } = req.body;

    if (!userId && !accountId) {
      return res.status(400).json({ message: "Either userId or accountId is required" });
    }

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    // Allowed updatable fields
    const allowedFields = [
      "phoneNumber","bio","displayName","dateOfBirth","maritalStatus",
      "role","theme","language","timezone","details","notifications","privacy"
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    // Handle profile avatar file
    if (req.file?.path) {
      const newFileName = path.basename(req.file.path);
      const existingProfile = await Profile.findOne({ $or: [{ userId }, { accountId }] });
      if (!existingProfile || path.basename(existingProfile.profileAvatar || "") !== newFileName) {
        updateData.profileAvatar = req.file.path;
      }
    }

    if (Object.keys(updateData).length === 0 && !userName) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // Check if profile exists
    let profile = await Profile.findOne({ $or: [{ userId }, { accountId }] });

    if (!profile) {
      // Create new profile settings document
      profile = new Profile({
        userId: userId || null,
        accountId: accountId || null,
        ...updateData,
        // Only push userName for creator/business
        userName: accountId ? userName : undefined
      });
      await profile.save();
    } else {
      // Update existing profile
      Object.assign(profile, updateData);
      if (accountId && userName) profile.userName = userName; // Only for creator/business
      await profile.save();
    }

    // Update User username if userId is provided (user account only)
    if (userId && userName) {
      const existingUser = await User.findOne({ userName });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Username already exists" });
      }
      await User.findByIdAndUpdate(userId, { userName }, { new: true });
    }

    // ✅ Update Account's profileData if creator/business
    if (accountId && profile._id) {
      await Account.findByIdAndUpdate(accountId, { profileData: profile._id }, { new: true });
    }

    // Populate for response
    const populatedProfile = await Profile.findById(profile._id).populate({
      path: "accountId",
      populate: { path: "userId", select: "userName email" }
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: populatedProfile
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

 


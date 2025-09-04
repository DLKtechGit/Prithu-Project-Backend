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
    const userId = req.Id || req.body.userId;
    console.log("userId",userId)
    const accountId = req.body.accountId;

    //  Require either userId or accountId
    if (!userId && !accountId) {
      return res
        .status(400)
        .json({ message: "Either userId or accountId is required" });
    }

    //  Reject if both are provided
    if (userId && accountId) {
      return res
        .status(400)
        .json({ message: "Provide either userId or accountId, not both" });
    }

    //  Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: errors.array() });
    }

    //  Allowed profile fields
    const allowedFields = [
      "phoneNumber",
      "bio",
      "displayName",
      "dateOfBirth",
      "maritalStatus",
      "theme",
      "language",
      "timezone",
      "details",
      "notifications",
      "privacy",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    //  Handle profile avatar
    if (req.file?.path) {
      updateData.profileAvatar = req.file.path;
    }

    //  Handle userName if provided
    const userName = req.body.userName;

    if (Object.keys(updateData).length === 0 && !userName) {
      return res
        .status(400)
        .json({ message: "No fields provided for update" });
    }

    let profile;

    // ---- Case 1: Update by userId ----
    if (userId) {
      profile = await Profile.findOne({ userId });

      if (!profile) {
        profile = new Profile({ userId, ...updateData });
      } else {
        Object.assign(profile, updateData);
      }

      if (userName) {
        const existingUser = await User.findOne({ userName });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
          return res.status(400).json({ message: "Username already exists" });
        }
        await User.findByIdAndUpdate(userId, { userName }, { new: true });
        profile.userName = userName;
      }
    }

    // ---- Case 2: Update by accountId ----
    if (accountId) {
      profile = await Profile.findOne({ accountId });

      if (!profile) {
        profile = new Profile({ accountId, ...updateData });
      } else {
        Object.assign(profile, updateData);
      }

      if (userName) {
        profile.userName = userName; // only in Profile
      }
    }

    await profile.save();

    // ✅ Link profile to account if accountId
    if (accountId && profile._id) {
      await Account.findByIdAndUpdate(
        accountId,
        { profileData: profile._id },
        { new: true }
      );
    }

    // ✅ Populate response
    const populatedProfile = await Profile.findById(profile._id).populate({
      path: "accountId",
      populate: { path: "userId", select: "userName email" },
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: populatedProfile,
    });
  } catch (error) {
    console.error("Error in userProfileDetailUpdate:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};









// Fetch profile by account ID
exports.getProfileDetail = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId // comes from auth middleware

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find profile by userId
    const profile = await Profile.findOne({ userId });
    const userName = await Profile.findOne({ userId }).populate("userId", "userName");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      profileSetting: profile,
      userName: userName.userId.userName
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



 


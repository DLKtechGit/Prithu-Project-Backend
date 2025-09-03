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
    let { userId, accountId, userName } = req.body;
    let roleFromBody = req.body.role; // used only if userId

    // ✅ Rule: Either userId or accountId required
    if (!userId && !accountId) {
      return res.status(400).json({ message: "Either userId or accountId is required" });
    }

    // ❌ Reject if both are provided
    if (userId && accountId) {
      return res.status(400).json({ message: "Provide either userId or accountId, not both" });
    }

    // ✅ Input validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    // Allowed fields (exclude role here, role handled separately)
    const allowedFields = [
      "phoneNumber","bio","displayName","dateOfBirth","maritalStatus",
      "theme","language","timezone","details","notifications","privacy"
    ];

    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });

    // ✅ Handle profile avatar
    if (req.file?.path) {
      updateData.profileAvatar = req.file.path;
    }

    if (Object.keys(updateData).length === 0 && !userName && !roleFromBody && !accountId) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // ✅ Separate profile lookups
    let profile = null;

    if (userId) {
      profile = await Profile.findOne({ userId });
      if (!profile) {
        profile = new Profile({ userId, ...updateData });
      } else {
        Object.assign(profile, updateData);
      }

      // role comes from request body
      if (roleFromBody) {
        profile.role = roleFromBody;
      }

      // handle userName update
      if (userName) {
        const existingUser = await User.findOne({ userName });
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
          return res.status(400).json({ message: "Username already exists" });
        }
        await User.findByIdAndUpdate(userId, { userName }, { new: true });
        profile.userName = userName;
      }
    }

    if (accountId) {
      profile = await Profile.findOne({ accountId });
      if (!profile) {
        profile = new Profile({ accountId, ...updateData });
      } else {
        Object.assign(profile, updateData);
      }

      // role comes from account.type
      const account = await Account.findById(accountId).select("type");
      if (account?.type) {
        profile.role = account.type;
      }

      // handle userName update (only in profile, not User)
      if (userName) {
        profile.userName = userName;
      }
    }

    await profile.save();

    // ✅ If accountId → link profile to account
    if (accountId && profile._id) {
      await Account.findByIdAndUpdate(accountId, { profileData: profile._id }, { new: true });
    }

    // ✅ Populate response
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
exports.getProfileDetail = async (req, res) => {
  try {
    const { accountId } = req.body;

    const userId=req.Id
    
    console.log("Fetching profile for:", { userId, accountId });

    if (!userId && !accountId) {
      return res
        .status(400)
        .json({ message: "Either userId or accountId is required" });
    }

    let profile;

    if (userId) {
      // Get profile for user
      profile = await Profile.findOne({ userId });
    } else if (accountId) {
      // Get profile for account
      profile = await Profile.findOne({ accountId })
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }


    return res.status(200).json({
      profileSetting: profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


 


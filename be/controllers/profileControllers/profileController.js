const { body, validationResult } = require("express-validator");
const Profile = require("../../models/profileSettingModel");
const User = require("../../models/userModels/userModel");
const Admin = require("../../models/adminModels/adminModel"); // missing in your code
const Account = require("../../models/accountSchemaModel");

// ✅ Validation middleware
exports.validateUserProfileUpdate = [
  body("phoneNumber").optional().isMobilePhone().withMessage("Invalid phone number"),
  body("bio").optional().isString(),
  body("maritalStatus").optional().isString(),
  body("dateOfBirth").optional().isISO8601().toDate(),
  body("profileAvatar").optional().isString(),
  body("userName").optional().isString(),
  body("displayName").optional().isString(),
  body("theme").optional().isIn(["light", "dark"]),
  body("language").optional().isString(),
  body("timezone").optional().isString(),
  body("details").optional(),
  body("notifications").optional().isObject(),
  body("privacy").optional().isObject(),
];

// ✅ Update profile controller
exports.userProfileDetailUpdate = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId;
    const { accountId } = req.body; // ← fixed
    const userRole = req.role || req.body.role ;

    if (!userId && !accountId) {
      return res.status(400).json({ message: "Either userId or accountId is required" });
    }

    if (userId && accountId) {
      return res.status(400).json({ message: "Provide either userId or accountId, not both" });
    }

    // ✅ Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation failed", errors: errors.array() });
    }

    // ✅ Collect allowed fields
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

    if (req.file?.path) updateData.profileAvatar = req.file.path;

    const userName = req.body.userName;

    if (Object.keys(updateData).length === 0 && !userName) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    let profile;

    // ---- Case 1: Update by userId ----
    if (userId) {
      // ✅ Upsert profile in one query
      profile = await Profile.findOneAndUpdate(
        { userId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      // ✅ Username logic
      if (userName) {
        const Model = userRole === "Admin" ? Admin : User;

        const existing = await Model.findOne({ userName }).lean();
        if (existing && existing._id.toString() !== userId.toString()) {
          return res.status(400).json({ message: "Username already exists" });
        }

        await Model.findByIdAndUpdate(
          userId,
          { userName, $set: { profileSettings: profile._id } },
          { new: true }
        ).lean();

        profile.userName = userName;
        profile.save()
      }
    }

    // ---- Case 2: Update by accountId ----
    if (accountId) {
      profile = await Profile.findOneAndUpdate(
        { accountId },
        { $set: { ...updateData, ...(userName ? { userName } : {}) } },
        { new: true, upsert: true }
      );

      // ✅ Link profile to account
      await Account.findByIdAndUpdate(accountId, { profileData: profile._id }, { new: true });
    }

    // ✅ Final populate only if account exists
    const populatedProfile = await Profile.findById(profile._id)
      .populate({
        path: "accountId",
        populate: { path: "userId", select: "userName email" },
      })
      .lean();

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
    const userId = req.Id || req.body.userId; // from auth middleware
    const userRole = req.role;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // ✅ Find profile once and populate userName based on role
    const profile = await Profile.findOne({ userId }).populate({
      path: "userId",
      model: userRole === "Admin" ? "Admin" : "User", // dynamic model
      select: "userName email", // only what you need
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      profileSetting: profile,
      userName: profile.userId?.userName || null,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




 


const { body, validationResult } = require("express-validator");
const Profile = require("../../models/profileSettingModel");
const User = require("../../models/userModels/userModel");
const Admin = require("../../models/adminModels/adminModel");
const ChildAdmin = require("../../models/childAdminModel");
const UserLanguage=require('../../models/userModels/userLanguageModel')

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

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // ✅ Validate request
    const errors = validateUserProfileUpdate(req);
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

    // ---- Update Profile for user ----
    let profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    // ---- Handle username uniqueness ----
    if (userName) {
      const existing = await User.findOne({ userName }).lean();
      if (existing && existing._id.toString() !== userId.toString()) {
        return res.status(400).json({ message: "Username already exists" });
      }

      await User.findByIdAndUpdate(
        userId,
        { userName, $set: { profileSettings: profile._id } },
        { new: true }
      ).lean();

      profile.userName = userName;
      await profile.save();
    }

    // ✅ Populate linked user (with username & email)
    const populatedProfile = await Profile.findById(profile._id)
      .populate("userId", "userName email")
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


exports.adminProfileDetailUpdate =async (req, res) => {
    try {
      // ---- Check validation errors ----
      const errors = validateUserProfileUpdate(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const adminId = req.Id || req.body.adminId;
      if (!adminId) {
        return res.status(400).json({ message: "adminId is required" });
      }

      // ---- Fetch admin and check role ----
      const admin = await Admin.findById(adminId).lean();
      if (!admin) return res.status(404).json({ message: "Admin not found" });
      if (admin.role !== "Admin")
        return res.status(403).json({ message: "Access denied: Not Admin" });

      // ---- Prepare update data ----
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
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) updateData[field] = req.body[field];
      });

      if (req.file?.path) updateData.profileAvatar = req.file.path;

      const userName = req.body.userName;

      if (Object.keys(updateData).length === 0 && !userName) {
        return res.status(400).json({ message: "No fields provided for update" });
      }

      // ---- Update or create profile ----
      let profile = await Profile.findOneAndUpdate(
        { adminId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      // ---- Handle username uniqueness ----
      if (userName) {
        const existingUser = await Admin.findOne({ userName }).lean();
        if (existingUser && existingUser._id.toString() !== adminId.toString()) {
          return res.status(400).json({ message: "Username already exists" });
        }

        await Admin.findByIdAndUpdate(
          adminId,
          { userName, profileSettings: profile._id },
          { new: true }
        );

        profile.userName = userName;
        await profile.save();
      }

      // ---- Populate profile for response ----
      const populatedProfile = await Profile.findById(profile._id)
        .populate("adminId", "userName email role")
        .lean();

      return res.status(200).json({
        message: "Admin profile updated successfully",
        profile: populatedProfile,
      });
    } catch (error) {
      console.error("Error in adminProfileDetailUpdate:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };




exports.childAdminProfileDetailUpdate =   async (req, res) => {
    try {
      const childAdminId = req.Id || req.body.childAdminId;
      if (!childAdminId) {
        return res.status(400).json({ message: "childAdminId is required" });
      }

      // ---- Check validation errors ----
      const errors = validateUserProfileUpdate(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Validation failed", errors: errors.array() });
      }

      // ---- Fetch Child Admin and role check ----
      const childAdmin = await ChildAdmin.findById(childAdminId).lean();
      if (!childAdmin) {
        return res.status(404).json({ message: "Child Admin not found" });
      }

      // ---- Allowed fields for profile update ----
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

      // ---- Update or create profile ----
      let profile = await Profile.findOneAndUpdate(
        { childAdminId },
        { $set: updateData },
        { new: true, upsert: true }
      );

      // ---- Handle username uniqueness ----
      if (userName) {
        const existing = await ChildAdmin.findOne({ userName }).lean();
        if (existing && existing._id.toString() !== childAdminId.toString()) {
          return res.status(400).json({ message: "Username already exists" });
        }

        await ChildAdmin.findByIdAndUpdate(
          childAdminId,
          { userName, profileSettings: profile._id },
          { new: true }
        );

        profile.userName = userName;
        await profile.save();
      }

      // ---- Populate profile for response ----
      const populatedProfile = await Profile.findById(profile._id)
        .populate("childAdminId", "userName email role")
        .lean();

      return res.status(200).json({
        message: "Child Admin profile updated successfully",
        profile: populatedProfile,
      });
    } catch (error) {
      console.error("Error in childAdminProfileDetailUpdate:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
;







// Fetch profile by account ID
exports.getProfileDetail = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId; // from auth middleware
    console.log(userId)
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
   
    // ✅ Fetch only what you need
    const profile = await Profile.findOne(
      { userId},
      "displayName bio phoneNumber profileAvatar theme language timezone notifications privacy"
    )
      .populate("userId", "userName email") // only fetch userName & email
      

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    return res.status(200).json({
      message: "Profile fetched successfully",
      profile,
      userName: profile.userId?.userName || null,
      userEmail:profile.userId?.email || null
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



exports.getAdminProfileDetail = async (req, res) => {
  try {
    const adminId = req.Id || req.body.adminId;

    if (!adminId) {
      return res.status(400).json({ success: false, message: "Admin ID is required" });
    }

    const admin = await Admin.findById(adminId)
      .select("userName email adminType")
      .lean();

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    return res.status(200).json({ success: true, admin });
  } catch (err) {
    console.error("Error fetching admin profile:", err);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch admin profile",
      error: err.message
    });
  }
};



exports.getChildAdminProfileDetail = async (req, res) => {
  try {
    const adminId = req.Id || req.body.adminId;

    if (!adminId) {
      return res.status(400).json({ success: false, message: "Child Admin ID is required" });
    }

    // ✅ Fetch child admin + admin details together
    const [childAdmin, admin] = await Promise.all([
      ChildAdmin.findOne({ userId: adminId }).lean(),
      Admin.findById(adminId).select("userName email adminType").lean()
    ]);

    if (!childAdmin || !admin) {
      return res.status(404).json({ success: false, message: "Child admin not found" });
    }

    // ✅ Fetch parent admin only if exists
    const parentAdmin = childAdmin.parentAdminId
      ? await Admin.findById(childAdmin.parentAdminId).select("userName email").lean()
      : null;

    return res.status(200).json({
      success: true,
      childAdmin: {
        ...admin,
        childAdmin,
        parentAdmin
      }
    });
  } catch (err) {
    console.error("Error fetching child admin profile:", err);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch child admin profile",
      error: err.message
    });
  }
};


exports.getUserProfileDetail = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId; // from auth middleware

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // ✅ Run queries in parallel
    const [user, profile, languages] = await Promise.all([
      User.findById(userId).select("userName email").lean(),
      Profile.findOne({ userId }).lean(),
      UserLanguage.find({ userId, active: true }).select("appLanguageCode feedLanguageCode").lean()
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        ...user,
        profile,
        languages
      }
    });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch user profile",
      error: err.message
    });
  }
};



 


const { body, validationResult } = require('express-validator');
const Profile = require('../../models/profileSettingModel');
const User=require('../../models/userModels/userModel')

// Validation middleware array
exports.validateUserProfileUpdate = [
  body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('bio').optional().isString(),
  body('maritalStatus').optional().isString(),
  body('displayName').optional().isString(),
  body('role').optional().isIn(['creator', 'business', 'consumer', 'admin']),
  body('roleRef').optional().isIn(['User', 'Business', 'Creator', 'Admin']),
  body('theme').optional().isIn(['light', 'dark']),
  body('language').optional().isString(),
  body('timezone').optional().isString(),
  body('details').optional(),
  body('notifications').optional().isObject(),
  body('privacy').optional().isObject(),
];

// Controller function
exports.userProfileDetailUpdate = async (req, res) => {
  // Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }

  try {
    const userId = req.params.id;
    const updateData = {};

    if (req.body.phoneNumber !== undefined) updateData.phoneNumber = req.body.phoneNumber;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.userName!== undefined) updateData.userName = req.body.Name;
    if (req.body.dateOfBirth !== undefined) updateData.dateOfBirth = req.body.dateOfBirth;
    if (req.body.maritalStatus !== undefined) updateData.maritalStatus = req.body.maritalStatus;
    if (req.body.displayName !== undefined) updateData.displayName = req.body.displayName;
    if (req.file?.path !== undefined) updateData.profileAvatar = req.file.path;
    if (req.body.role !== undefined) updateData.role = req.body.role;
    if (req.body.roleRef !== undefined) updateData.roleRef = req.body.roleRef;
    if (req.body.theme !== undefined) updateData.theme = req.body.theme;
    if (req.body.language !== undefined) updateData.language = req.body.language;
    if (req.body.timezone !== undefined) updateData.timezone = req.body.timezone;
    if (req.body.details !== undefined) updateData.details = req.body.details;
    if (req.body.notifications !== undefined) updateData.notifications = req.body.notifications;
    if (req.body.privacy !== undefined) updateData.privacy = req.body.privacy;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    const updatedOrCreatedProfile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('userId');  // Populate dynamically based on roleRef
 
    if(req.body.role==="User"&&updatedOrCreatedProfile.userName)
    {
    await User.findByIdAndUpdate
  (userId,{$set:{profileSettings:updatedOrCreatedProfile._id,username:updatedOrCreatedProfile.userName}})
    }

    return res.status(200).json({
      message: 'User profile setting updated or created successfully',
      profile: updatedOrCreatedProfile,
    });
  } catch (error) {
    console.error('Error in userProfileDetailUpdate:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.profileDetailWithId = async (req, res) => {
  try {
    // Populate userId and only bring the username
    const profile = await Profile.findOne({ userId: req.params.id })
      .populate({ path: 'userId', select: 'username' });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });  
    }

    res.status(200).json({
      profileSetting: profile,
      userName: profile.userId.username   // Extract username from the populated userId
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Internal server error' });  
  }
};


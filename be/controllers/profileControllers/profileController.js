const { body, validationResult } = require('express-validator');
const UserProfile = require('../../models/profileSettingModel');

// Validation middleware array
exports.validateUserProfileUpdate = [
  body('phoneNumber').optional().isMobilePhone().withMessage('Invalid phone number'),
  body('bio').optional().isString(),
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

    const updatedOrCreatedProfile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate('userId');  // Populate dynamically based on roleRef

    return res.status(200).json({
      message: 'User profile setting updated or created successfully',
      profile: updatedOrCreatedProfile,
    });
  } catch (error) {
    console.error('Error in userProfileDetailUpdate:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

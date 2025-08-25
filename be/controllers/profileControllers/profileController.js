const UserProfile = require('../../models/profileSettingModel');

exports.userProfileDetailUpdate = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = {};

    // Collect fields from the request
    if (req.body.phoneNumber !== undefined) updateData.phoneNumber = req.body.phoneNumber;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.displayName !== undefined) updateData.displayName = req.body.displayName;
    if (req.file?.path !== undefined) updateData.profileAvatar = req.file.path;
    if (req.body.role !== undefined) updateData.role = req.body.role;
    if (req.body.theme !== undefined) updateData.theme = req.body.theme;
    if (req.body.language !== undefined) updateData.language = req.body.language;
    if (req.body.timezone !== undefined) updateData.timezone = req.body.timezone;
    if (req.body.details !== undefined) updateData.details = req.body.details;
    
    // Notifications (update nested object fields)
    if (req.body.notifications !== undefined) updateData.notifications = req.body.notifications;

    // Privacy (update nested object fields)
    if (req.body.privacy !== undefined) updateData.privacy = req.body.privacy;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    const updatedOrCreatedProfile = await UserProfile.findOneAndUpdate(
      { userId },       
      { $set: updateData },
      { new: true, upsert: true, setDefaultsOnInsert: true } 
    );

    return res.status(200).json({
      message: 'User profile setting updated or created successfully',
      profile: updatedOrCreatedProfile,
    });
  } catch (error) {
    console.error('Error in upsertUserProfileSetting:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

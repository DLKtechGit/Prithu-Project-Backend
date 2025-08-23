const UserProfile = require('../../models/userModels/userProfileModel');

exports. userProfileDetailUpdate = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = {};

    // Collect  fields from the request
    if (req.body.phoneNumber !== undefined) updateData.phoneNumber = req.body.phoneNumber;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.displayName !== undefined) updateData.displayName = req.body.displayName;
    if (req.file?.path !== undefined) updateData.profileAvatar = req.file.path;

     

    console.log(updateData)

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

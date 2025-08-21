const LaptopUser =require ('../models/userModel');




// Get laptop user details including media
    exports.getLaptop_Users= async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await LaptopUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};





// Get All Media
    exports.getAll_Media=async (req, res) => {
  try {
    // Fetch all media from the Media collection
    const mediaItems = await Media.find({});
    console.log('Media items from collection:', mediaItems);
    
    // Extract file URLs
    const mediaUrls = mediaItems.map(item => item.fileUrl);
    console.log('Media URLs from media collection:', mediaUrls);
    
    res.json({ mediaUrls });
  } catch (error) {
    console.error('Error fetching media:', error);
    res.status(500).json({ error: error.message });
  }
};



  






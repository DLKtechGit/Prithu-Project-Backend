const Tags = require('../models/tagModel');


exports.getAllTags = async (req, res) => {
  try {

    const tags = await Tags.find()
      .sort({ createdAt: -1 })
      .populate({ path: "feedIds" });

    if (!tags || tags.length === 0) {
      return res.status(404).json({ message: 'No Tags found' });
    }


    return res.status(200).json({
      message: 'Tags retrieved successfully',
      tags
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

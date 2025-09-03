const Tags = require('../models/categorySchema');
const { param } = require('../roots/root');


exports.getAllTags = async (req, res) => {
  try {

    const tags = await Tags.find()
      .sort({ createdAt: -1 });

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

exports.getTagsWithId = async (req, res) => {
  try {
    const  tagId  = req.params.id;

    const tagFeeds = await Tags.findById(tagId).populate('feedIds');

    if (!tagFeeds) {
      return res.status(400).json({ message: 'Videos not Found in this Tag' });
    }

    res.status(200).json({
      tagFeeds
    });
  } catch (error) {
    console.error('Error fetching tag feeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


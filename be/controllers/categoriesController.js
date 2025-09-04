const Categories= require('../models/categorySchema');


exports.getAllCategories = async (req, res) => {
  try {

    const categories = await Categories.find()
      .sort({ createdAt: -1 });

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No Categories found' });
    }


    return res.status(200).json({
      message: 'Categories retrieved successfully',
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getCategoryWithId = async (req, res) => {
  try {
    const  categoriesId  = req.params.id;

    const categoriesFeeds = await Categories.findById(categoriesId).populate('feedIds');

    if (!categoriesFeeds) {
      return res.status(400).json({ message: 'Videos not Found in this categories' });
    }

    res.status(200).json({
      categoriesFeeds
    });
  } catch (error) {
    console.error('Error fetching categories feeds:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const FeedCategory = require('../../models/adminModels/feedCategoryModel');

exports.createCategory = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    // Trim and format name: first letter capital, rest lowercase
    name = name.trim();
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

    // Check if category already exists (case-insensitive)
    const existingCategory = await FeedCategory.findOne({ name: { $regex: `^${formattedName}$`, $options: 'i' } });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // Create and save new category
    const newCategory = new FeedCategory({ name: formattedName });
    await newCategory.save();

    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// exports.updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;

//     const updatedCategory = await FeedCategory.findByIdAndUpdate(id, { name }, { new: true });
//     if (!updatedCategory) {
//       return res.status(404).json({ message: 'Category not found' });
//     }

//     res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
//   } catch (error) {
//     console.error('Error updating category:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await FeedCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

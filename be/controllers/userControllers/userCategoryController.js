const UserFeedCategory=require('../../models/userModels/userCategotyModel')

exports.userSelectCategory = async (req, res) => {
  try {
    const { categoryIds } = req.body; // Expecting array of categoryIds
    const userId = req.Id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ message: "At least one Category ID is required" });
    }

    // ✅ Ensure UserCategory doc exists
    let userCategory = await UserCategory.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, interestedCategories: [], nonInterestedCategories: [] } },
      { new: true, upsert: true }
    );

    // ✅ Convert existing IDs to string for comparison
    const existingInterested = userCategory.interestedCategories.map(id => id.toString());

    // ✅ Separate new vs existing
    const toInsert = categoryIds.filter(id => !existingInterested.includes(id));

    if (toInsert.length > 0) {
      await UserCategory.updateOne(
        { userId },
        { $addToSet: { interestedCategories: { $each: toInsert } } }
      );
    }

    // ✅ Fetch final updated doc
    const updatedDoc = await UserCategory.findOne({ userId })
      .populate("interestedCategories", "name") // optional populate
      .populate("nonInterestedCategories", "name")
      .lean();

    res.status(200).json({
      message: "Categories selected successfully",
      data: updatedDoc,
    });
  } catch (err) {
    console.error("Error selecting categories:", err);
    res.status(500).json({
      message: "Error selecting categories",
      error: err.message,
    });
  }
};

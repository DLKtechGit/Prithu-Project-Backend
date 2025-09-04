
const Users = require("../../models/userModels/userModel")
const UserFeedCategory = require("../../models/userModels/userCatogorySchema")


exports.getUserdetailWithId = async (req, res) => {
  try {
    const userId = req.Id || req.body.userId; // Get user ID from auth middleware
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await Users.findById(userId); 
    if (!user) {
      return res.status(400).json({ message: "User Details not Found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Cannot Fetch User Details", error: err });
  }
};

 exports.getAllUserDetails=async (req,res)=>  
{
  try{
      const allUsers=await Users.find()
      if(!allUsers)res.status(400).json({ message: "Users Details not Found" });
  
    res.status(200).json({ allUsers });
  } catch (err) {
    res.status(500).json({ message: "Cannot Fetch User Details", error: err });
  }

}

exports.userSelectCategory = async (req, res) => {
  try {
    const { categoryIds } = req.body; // Expecting array of categoryIds
    const userId = req.Id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({ message: "At least one Category ID is required" });
    }

    // Ensure user document exists (upsert)
    let userFeedCategory = await UserFeedCategory.findOneAndUpdate(
      { userId },
      { $setOnInsert: { userId, categories: [] } },
      { upsert: true, new: true }
    );

    // Get existing categoryIds in user document
    const existingIds = userFeedCategory.categories.map(cat => cat.categoryId.toString());

    // Separate new vs existing
    const toActivate = categoryIds.filter(id => existingIds.includes(id));
    const toInsert = categoryIds.filter(id => !existingIds.includes(id));

    // 1. Activate already existing ones
    if (toActivate.length > 0) {
      await UserFeedCategory.updateOne(
        { userId },
        {
          $set: { updatedAt: new Date() },
          $set: {
            "categories.$[elem].isActive": true,
            "categories.$[elem].followedAt": new Date(),
          },
        },
        {
          arrayFilters: [{ "elem.categoryId": { $in: toActivate } }],
        }
      );
    }

    // 2. Push new ones
    if (toInsert.length > 0) {
      const newCats = toInsert.map(id => ({
        categoryId: id,
        isActive: true,
        followedAt: new Date(),
      }));

      await UserFeedCategory.updateOne(
        { userId },
        {
          $push: { categories: { $each: newCats } },
          $set: { updatedAt: new Date() },
        }
      );
    }

    // Fetch final updated doc
    const updatedDoc = await UserFeedCategory.findOne({ userId }).lean();

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

exports.userAppLanguage = async (req, res) => {
  try {
    const userId = req.userId; // Get user ID from auth middleware
    const { language } = req.body;
    if (!language) {
      return res.status(400).json({ message: "Language is required" });
    }

    // Create a new language entry in the database
    const newLanguage = await Users.findByIdAndUpdate(userId, { appLanguage: language }, { new: true });

    res.status(201).json({ message: "Language created successfully", newLanguage });
  } catch (err) {
    res.status(500).json({ message: "Error creating language", error: err });
  }
};

exports.userFeedLanguage = async (req, res) => {
  try {
    const userId = req.userId; // Get user ID from auth middleware
    const { language } = req.body; 
    if (!language) {
      return res.status(400).json({ message: "Language is required" });
    } 
    // Create a new language entry in the database
    const newLanguage = await Users.findByIdAndUpdate(userId, { feedLanguage: language }, { new: true });

    res.status(201).json({ message: "Feed Language created successfully", newLanguage });
  } catch (err) {
    res.status(500).json({ message: "Error creating feed language", error: err });
  }
};

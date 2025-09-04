
const Users = require("../../models/userModels/userModel")
const UserFeedCategory = require("../../models/userModels/userCatogorySchema")


exports.getUserdetailWithId = async (req, res) => {
  try {
    const userId = req.params.id; 
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
  console.log('working')
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
    const { categoryId } = req.body;
    const userId = req.Id; // must come from auth middleware

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }

    // Find user's category document
    let userFeedCategory = await UserFeedCategory.findOne({ userId });

    if (!userFeedCategory) {
      // If user has no record, create a new one
      userFeedCategory = new UserFeedCategory({
        userId,
        categories: [{ categoryId }],
      });
    } else {
      // Check if category already exists
      const existing = userFeedCategory.categories.find(
        (cat) => cat.categoryId.toString() === categoryId
      );

      if (existing) {
        // If already exists, make sure it's active
        existing.isActive = true;
      } else {
        // Otherwise, add new category
        userFeedCategory.categories.push({ categoryId });
      }
    }

    await userFeedCategory.save();

    res.status(200).json({
      message: "Category selected successfully",
      data: userFeedCategory,
    });
  } catch (err) {
    console.error("Error selecting category:", err);
    res.status(500).json({ message: "Error selecting category", error: err.message });
  }
};



exports.createAppLanguage = async (req, res) => {
  try {
    const { language } = req.body;
    if (!language) {
      return res.status(400).json({ message: "Language is required" });
    }

    // Create a new language entry in the database
    const newLanguage = await Languages.create({ language });
    res.status(201).json({ message: "Language created successfully", newLanguage });
  } catch (err) {
    res.status(500).json({ message: "Error creating language", error: err });
  }
};

exports.createFeedLanguage = async (req, res) => {}

const Account = require('../models/accountSchemaModel');
const User = require('../models/userModels/userModel');

// Add a new account (User → Business/Creator)
exports.addAccount = async (req, res) => {
  try {

    const formattedType = req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1).toLowerCase()
    const type = formattedType; // "Business" or "Creator"

    const userId = req.Id;
    // const userId = req.body.userId; // Assuming user ID is available in req.Id after authentication middleware

    if (!type) {
      return res.status(400).json({ message: "Account type is required" });
    }

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Check if account already exists for this user
    const exists = await Account.findOne({ userId, type });
    if (exists) {
      return res.status(400).json({ message: `${type} account already exists` });
    }

    // Create new account
    const account = new Account({ userId, type });
    await account.save();

    // Update user's roles array if not already included
    const user = await User.findById(userId);
    if (!user.roles.includes(type)) {
      user.roles.push(type); // Add new role
    }

    // Optionally update user's active account to the new one if not set
    if (!user.activeAccount) {
      user.activeAccount = account._id;
    }

    await user.save();

    return res.status(201).json({ message: `${type} account created`, account });
  } catch (err) {
    console.error("AddAccount Error:", err);
    return res.status(500).json({ message: "Error creating account", error: err.message });
  }
};


// Switch active account
exports.switchAccount = async (req, res) => {
  try {
    const { accountId } = req.body;
    const userId = req.Id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const account = await Account.findOne({ _id: accountId, userId: userId });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Update user's active account
    const user = await User.findById(userId);
    user.activeAccount = account._id;
    await user.save();

    return res.status(200).json({ message: "Switched account", activeAccount: account });
  } catch (err) {
    console.error("SwitchAccount Error:", err);
    return res.status(500).json({ message: "Error switching account", error: err.message });
  }
};

// Get currently active account
exports.getActiveAccount = async (req, res) => {
  try {
    const userId=req.Id
    const user = await User.findById(userId).populate("activeAccount");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ activeAccount: user.activeAccount });
  } catch (err) {
    console.error("GetActiveAccount Error:", err);
    return res.status(500).json({ message: "Error fetching active account", error: err.message });
  }
};


// Get all accounts for a user
exports.getAllAccounts = async (req, res) => {
  try {
    const userId = req.Id;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const accounts = await Account.find({ userId: userId });

    return res.status(200).json({ accounts });
  } catch (err) {
    console.error("GetAllAccounts Error:", err);
    return res.status(500).json({ message: "Error fetching accounts", error: err.message });
  }
};

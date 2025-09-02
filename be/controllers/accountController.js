const Account = require('../models/accountSchemaModel');
const User = require('../models/userModels/userModel');

// Add a new account (User → Business/Creator)
exports.addAccount = async (req, res) => {
  try {
    const { type } = req.body;

    if (!type) {
      return res.status(400).json({ message: "Account type is required" });
    }

    // Check if account already exists for this user
    const exists = await Account.findOne({ userId: req.user.id, type });
    if (exists) {
      return res.status(400).json({ message: `${type} account already exists` });
    }

    // Create new account
    const account = new Account({ userId: req.user.id, type });
    await account.save();

    // Optionally update user's active account to the new one
    const user = await User.findById(req.user.id);
    if (!user.activeAccount) {
      user.activeAccount = account._id;
      await user.save();
    }

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

    if (!accountId) {
      return res.status(400).json({ message: "Account ID is required" });
    }

    const account = await Account.findOne({ _id: accountId, userId: req.user.id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Update user's active account
    const user = await User.findById(req.user.id);
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
    const user = await User.findById(req.user.id).populate("activeAccount");

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
    const accounts = await Account.find({ userId: req.user.id });

    return res.status(200).json({ accounts });
  } catch (err) {
    console.error("GetAllAccounts Error:", err);
    return res.status(500).json({ message: "Error fetching accounts", error: err.message });
  }
};

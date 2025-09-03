const Account = require('../models/accountSchemaModel');
const User = require('../models/userModels/userModel');


// Create a JWT token
const generateToken = (userId, role, accountId = null, userName) => {
  const payload = { userId, role, accountId, userName };
  return jwt.sign(payload, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '7d' });
};


// Add a new account (User → Business/Creator)
exports.addAccount = async (req, res) => {
  try {
    const userId = req.Id; // from auth middleware
    const { type } = req.body; // "creator" or "business"

    if (!type) return res.status(400).json({ message: "Account type is required" });

    const formattedType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    
    // Check if account already exists
    let account = await Account.findOne({ userId, type: formattedType });
    if (account) return res.status(400).json({ message: `${formattedType} account already exists` });

    // Create new account
    account = new Account({ userId, type: formattedType });
    await account.save();

    // Update user's roles array and activeAccount
    const user = await User.findById(userId);
    if (!user.roles.includes(formattedType)) user.roles.push(formattedType);
    user.activeAccount = account._id;
    await user.save();

    // Generate token for the new account
    const token = generateToken({ userId, role: formattedType, accountId: account._id, userName: user.userName });

    res.status(201).json({ message: `${formattedType} account created`, account, token });
  } catch (err) {
    console.error("AddAccount Error:", err);
    res.status(500).json({ message: "Error creating account", error: err.message });
  }
};



exports.switchToCreator = async (req, res) => {
  try {
    const userId = req.Id;

    let account = await Account.findOne({ userId, type: "Creator" });
    if (!account) return res.status(404).json({ message: "Creator account not found" });

    // Update activeAccount
    const user = await User.findById(userId);
    user.activeAccount = account._id;
    await user.save();

    const token = generateToken({ userId, role: "Creator", accountId: account._id, userName: user.userName });

    res.status(200).json({ message: "Switched to Creator account", account, token });
  } catch (err) {
    console.error("SwitchToCreator Error:", err);
    res.status(500).json({ message: "Error switching account", error: err.message });
  }
};



exports.switchToUserAccount = async (req, res) => {
  try {
    const userId = req.Id;

    // Clear activeAccount
    await User.findByIdAndUpdate(userId, { activeAccount: null });

    // Generate user token
    const token = generateToken({
      userId,
      role: "User",
    });

    return res.status(200).json({
      message: "Switched back to User account",
      token,
    });
  } catch (err) {
    console.error("switchToUserAccount Error:", err);
    res.status(500).json({ message: "Error switching to user account", error: err.message });
  }
};

// ✅ Check account status (for frontend button logic)
// Controller
exports.checkAccountStatus = async (req, res) => {
  try {
    const userId = req.Id; // from auth middleware

    const creatorAccount = await Account.findOne({ userId, type: "Creator" });

    if (!creatorAccount) {
      return res.status(404).json({ message: "Creator account not found" });
    }

    return res.status(200).json({ 
      message: "Creator account exists",
      account: creatorAccount 
    });
  } catch (err) {
    console.error("CheckCreatorAccount Error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


// // ✅ Get all accounts linked to user
// exports.getAllAccounts = async (req, res) => {
//   try {
//     const userId = req.Id;

//     const user = await User.findById(userId).populate("activeAccount");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const accounts = await Account.find({ userId });

//     return res.status(200).json({
//       activeAccount: user.activeAccount,
//       accounts,
//     });
//   } catch (err) {
//     console.error("getAllAccounts Error:", err);
//     res.status(500).json({ message: "Error fetching accounts", error: err.message });
//   }
// };



// exports.switchToBusiness = async (req, res) => {




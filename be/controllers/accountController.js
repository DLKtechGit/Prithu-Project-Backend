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
    const type = req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1).toLowerCase();
    // const userId = req.body.userId;
    const userId=req.Id // from auth middleware

    if (!type || !userId) {
      return res.status(400).json({ message: "Account type and User ID are required" });
    }

    const exists = await Account.findOne({ userId, type });
    if (exists) return res.status(400).json({ message: `${type} account already exists` });

    const account = new Account({ userId, type });
    await account.save();

    const user = await User.findById(userId);
    if (!user.roles.includes(type)) user.roles.push(type);
    user.activeAccount = account._id;
    await user.save();

    const token = auth(userId, type.toLowerCase(), account._id);

    res.status(201).json({ message: `${type} account created`, account, token });
  } catch (err) {
    console.error("AddAccount Error:", err);
    res.status(500).json({ message: "Error creating account", error: err.message });
  }
}



// Switch active account
exports.switchAccount = async (req, res) => {
  try {
    const  accountId = req.accountId // from auth middleware
    const userId = req.Id; // from auth middleware

    if (!userId || !accountId) return res.status(400).json({ message: "User ID and Account ID are required" });

    const account = await Account.findOne({ _id: accountId, userId });
    if (!account) return res.status(404).json({ message: "Account not found" });

    const user = await User.findById(userId);
    user.activeAccount = account._id;
    await user.save();

    const token = generateToken(userId, account.type.toLowerCase(), account._id);

    res.status(200).json({ message: "Switched account", activeAccount: account, token });
  } catch (err) {
    console.error("SwitchAccount Error:", err);
    res.status(500).json({ message: "Error switching account", error: err.message });
  }
}


// Get currently active account
exports.getActiveAccount = async (req, res) => {
  try {
    const userId = req.Id; // from auth middleware
    const user = await User.findById(userId).populate("activeAccount");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ activeAccount: user.activeAccount });
  } catch (err) {
    console.error("GetActiveAccount Error:", err);
    res.status(500).json({ message: "Error fetching active account", error: err.message });
  }
};



// Get all accounts for a user
exports.getAllAccounts = async (req, res) => {
  try {
    const userId = req.Id; // from auth middleware
    const accounts = await Account.find({ userId });
    res.status(200).json({ accounts });
  } catch (err) {
    console.error("GetAllAccounts Error:", err);
    res.status(500).json({ message: "Error fetching accounts", error: err.message });
  }
};


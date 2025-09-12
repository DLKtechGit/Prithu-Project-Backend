const User = require('../../models/userModels/userModel');
const { placeReferral } = require('../../middlewares/referralCount');

/**
 * Apply a referral code for an existing user.
 * - Validates the referral code
 * - Updates the user's referredByUserId
 * - Places the user under the referral tree
 */
exports.applyReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const userId=req.Id || req.body.userId;

    if (!userId || !referralCode) {
      return res.status(400).json({ message: "userId and referralCode are required" });
    }

    // 1️⃣ Find the parent user who owns this referral code
    const parentUser = await User.findOne({ referralCode, referralCodeIsValid: true });
    if (!parentUser) {
      return res.status(400).json({ message: "Referral code is invalid or expired" });
    }

    // 2️⃣ Prevent self-referral
    if (parentUser._id.toString() === userId) {
      return res.status(400).json({ message: "Cannot use your own referral code" });
    }

    // 3️⃣ Check if this user already has a referrer
    const childUser = await User.findById(userId);
    if (childUser.referredByUserId) {
      return res.status(400).json({ message: "Referral code already applied" });
    }

    // 4️⃣ Update child user with referrer info
    childUser.referredByUserId = parentUser._id;
    childUser.referredByCode = referralCode;
    await childUser.save();

    // 5️⃣ Place referral in the tree (idempotent)
    await placeReferral({ parentId: parentUser._id, childId: userId });

    return res.status(200).json({ message: "Referral code applied successfully" });

  } catch (err) {
    console.error("ApplyReferralCode error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

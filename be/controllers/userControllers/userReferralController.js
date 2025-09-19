const User = require('../../models/userModels/userModel');
const { placeReferral } = require('../../middlewares/referralMiddleware/referralCount');

/**
 * applyReferralCode(req, res)
 * - apply code for existing user (e.g., after signup)
 * - increments referrer count atomically
 * - places the referral
 */
exports.applyReferralCode = async (req, res) => {
  try {
    const { referralCode } = req.body;
    const userId = req.Id || req.body.userId;
    if (!userId || !referralCode) return res.status(400).json({ message: "userId and referralCode required" });

    const parentUser = await User.findOne({ referralCode, referralCodeUsageCount: { $lt: 2 } });
    if (!parentUser) return res.status(400).json({ message: "Referral code invalid or not available" });

    if (parentUser._id.toString() === userId) return res.status(400).json({ message: "Cannot use your own referral code" });

    const childUser = await User.findById(userId);
    if (!childUser) return res.status(400).json({ message: "Child user not found" });
    if (childUser.referredByUserId) return res.status(400).json({ message: "Referral code already applied" });

    // atomically increment referrer's count
    const updatedRef = await User.findOneAndUpdate({ _id: parentUser._id, referralCodeUsageCount: { $lt: 2 } }, { $inc: { referralCodeUsageCount: 1 } }, { new: true });
    if (!updatedRef) return res.status(400).json({ message: "Referral code no longer available" });

    // update child
    childUser.referredByUserId = parentUser._id;
    childUser.referredByCode = referralCode;
    await childUser.save();

    // place referral (idempotent)
    try {
      await placeReferral({ parentId: parentUser._id, childId: childUser._id });
    } catch (err) {
      console.warn("placeReferral warning:", err.message);
    }

    return res.status(200).json({ message: "Referral code applied" });
  } catch (err) {
    console.error("applyReferralCode error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

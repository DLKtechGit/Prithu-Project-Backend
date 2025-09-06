const ReferralEdge = require("../../models/userModels/userRefferalModels/refferalEdgeModle");
const User = require("../../models/userModels/userModel");

// Get left referrals for a user
exports.getLeftReferrals = async (req, res) => {
    console.log("woking")
  try {
    const  userId  = req.body.userId;
    console.log(userId)

    const edges = await ReferralEdge.find({ parentId: userId, side: "left" })
    //   .populate("childId", "userName email referralCode") // populate child user details
    //   .sort({ createdAt: 1 }); // oldest first
 console.log(edges)
    return res.status(200).json({
      count: edges.length,
      referrals: edges.map(edge => ({
        childId: edge.childId._id,
        userName: edge.childId.userName,
        email: edge.childId.email,
        referralCode: edge.childId.referralCode,
        level: edge.level,
        joinedAt: edge.createdAt
      }))
    });
  } catch (err) {
    console.error("Error fetching left referrals:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get right referrals for a user
exports.getRightReferrals = async (req, res) => {
  try {
    const { userId } = req.body;

    const edges = await ReferralEdge.find({ parentId: userId, side: "right" })
      .populate("childId", "userName email referralCode")
      .sort({ createdAt: 1 });

    return res.status(200).json({
      count: edges.length,
      referrals: edges.map(edge => ({
        childId: edge.childId._id,
        userName: edge.childId.userName,
        email: edge.childId.email,
        referralCode: edge.childId.referralCode,
        level: edge.level,
        joinedAt: edge.createdAt
      }))
    });
  } catch (err) {
    console.error("Error fetching right referrals:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

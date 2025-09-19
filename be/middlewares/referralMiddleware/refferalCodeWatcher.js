const User = require('../../models/userModels/userModel');
const ReferralEdge = require('../../models/userModels/userRefferalModels/refferalEdgeModle');
const DirectFinisher = require('../../models/userModels/userRefferalModels/directFinishersModel');
const { onUserSubscriptionComplete } = require('../referralMiddleware/handleSubscriptionCheck');

exports.startWatcher = () => {
  // 🔹 Watch for updates to User documents
  const changeStream = User.watch([
    {
      $match: {
        operationType: "update",
        "updateDescription.updatedFields.subscription.isActive": { $exists: true }
      }
    }
  ], { fullDocument: "updateLookup" });

  // 🔹 Listen for subscription status changes
  changeStream.on("change", async (change) => {
    try {
      const userId = change.documentKey._id;
      const newSubStatus = change.updateDescription.updatedFields["subscription.isActive"];

      console.log(`Watcher detected subscription change for user ${userId}: ${newSubStatus}`);

      // 1️⃣ Find referral edge where this user is a child
      const edge = await ReferralEdge.findOne({ childId: userId }).sort({ createdAt: 1 });
      if (!edge) {
        console.log("No referral edge found for user", userId);
        return;
      }

      // 2️⃣ Update DirectFinisher entry
      await DirectFinisher.updateOne(
        { parentId: edge.parentId, childId: userId },
        {
          $set: {
            status: newSubStatus ? "finished" : "incomplete",
            side: edge.side,
            updatedAt: new Date()
          },
          $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
      );

      console.log(`DirectFinisher updated for parent ${edge.parentId} and child ${userId}`);

      // 3️⃣ If subscription activated → trigger earnings check
      if (newSubStatus) {
        await onUserSubscriptionComplete(userId);
        console.log(`Earnings process triggered for user ${userId}`);
      }
    } catch (err) {
      console.error("Watcher error in handling subscription change:", err);
    }
  });

  changeStream.on("error", (err) => {
    console.error("Watcher error:", err);
  });

  console.log("Referral watcher started ✅");
};

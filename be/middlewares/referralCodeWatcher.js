const mongoose = require("mongoose");
const User = require("../models/userModels/userModel");
const ReferralEdge = require("../models/userModels/userRefferalModels/refferalEdgeModle");
const DirectFinisher = require("../models/userModels/userRefferalModels/directReferralFinishers");
const { onUserSubscriptionComplete } = require("../middlewares/referralCount");

/**
 * Watch for changes in referralCodeIsValid field
 * and update DirectFinisher table accordingly
 */
exports.startWatcher=() =>{
  const changeStream = User.watch(
    [
      {
        $match: {
          operationType: "update",
          "updateDescription.updatedFields.referralCodeIsValid": { $exists: true },
        },
      },
    ],
    { fullDocument: "updateLookup" }
  );

  changeStream.on("change", async (change) => {
    try {
      const userId = change.documentKey._id;
      const newValid = change.updateDescription.updatedFields.referralCodeIsValid;

      // find parent edge (child -> parent)
      const edge = await ReferralEdge.findOne({ childId: userId }).sort({ createdAt: 1 });
      if (!edge) return;

      // update DirectFinisher row for parent->child
      await DirectFinisher.updateOne(
        { parentId: edge.parentId, childId: userId },
        {
          $set: {
            status: newValid ? "finished" : "incomplete",
            side: edge.side,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );

      if (newValid) {
        console.log(`Referral finished: parent=${edge.parentId}, child=${userId}`);
        // Trigger earnings and promotion
        await onUserSubscriptionComplete(userId);
      }
    } catch (err) {
      console.error("ChangeStream processing error:", err);
    }
  });

  changeStream.on("error", (err) => {
    console.error("ChangeStream error:", err);
    // Reconnect handled externally via PM2, Docker, or manual restart
  });

  console.log("Referral code watcher started ✅");
}



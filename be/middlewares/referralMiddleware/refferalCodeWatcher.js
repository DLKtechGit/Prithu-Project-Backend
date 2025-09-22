const User = require('../../models/userModels/userModel');
const ReferralEdge = require('../../models/userModels/userRefferalModels/refferalEdgeModle');
const DirectFinisher = require('../../models/userModels/userRefferalModels/directFinishersModel');
const { onSubscriptionActivated } = require('../referralMiddleware/referralCount');

exports.startWatcher = () => {
  const changeStream = User.watch(
    [
      {
        $match: {
          operationType: "update",
          $or: [
            { "updateDescription.updatedFields.subscription.isActive": { $exists: true } },
            { "updateDescription.updatedFields.subscription": { $exists: true } }
          ]
        }
      }
    ],
    { fullDocument: "updateLookup" }
  );

  changeStream.on("change", async (change) => {
    try {
      const userId = change.documentKey._id;
      const newSubStatus = change.updateDescription.updatedFields["subscription.isActive"];
      console.log(`Watcher: subscription change for ${userId} => ${newSubStatus}`);

      const edge = await ReferralEdge.findOne({ childId: userId }).sort({ createdAt: 1 });

      if (edge) {
        await DirectFinisher.updateOne(
          { parentId: edge.parentId, childId: userId },
          {
            $set: {
              status: newSubStatus ? "finished" : "incomplete",
              side: edge.side,
              updatedAt: new Date()
            },
            $setOnInsert: {
              createdAt: new Date(),
              parentId: edge.parentId,
              childId: userId
            }
          },
          { upsert: true }
        );
      }

      if (newSubStatus) {
        await onSubscriptionActivated(userId);
      }
    } catch (err) {
      console.error("Watcher error:", err);
    }
  });

  changeStream.on("error", (err) => {
    console.error("Watcher stream error:", err);
    setTimeout(exports.startWatcher, 5000); // auto restart
  });

  console.log("Referral watcher started");
};

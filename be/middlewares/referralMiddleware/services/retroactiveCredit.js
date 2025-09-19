const mongoose = require("mongoose");
const User = require("../../../models/userModels/userModel");
const DirectFinisher = require("../../../models/userModels/userRefferalModels/directFinishersModel");
const UserEarning = require("../../../models/userModels/userRefferalModels/referralEarnings");
const UserLevel = require("../../../models/userModels/userRefferalModels/userReferralLevelModel");
const { computeThreshold } = require("./threshHold");

const LEVEL_SHARE_AMOUNT = 250;

/**
 * Retroactively process earnings for a parent user
 * when the parent subscribes after some children have subscribed
 */
async function processRetroactiveEarnings(parentId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find all children whose subscriptions are active
    const finishers = await DirectFinisher.find({ parentId, status: "finished" }).session(session);

    if (!finishers.length) {
      await session.commitTransaction();
      session.endSession();
      return;
    }

    // Get current level or create
    let levelDoc = await UserLevel.findOne({ userId: parentId, level: 1 }).session(session);
    if (!levelDoc) {
      levelDoc = await UserLevel.create([{ 
        userId: parentId, 
        level: 1, 
        tier: 1,
        leftTreeCount: 0, 
        rightTreeCount: 0,
        threshold: computeThreshold(1),
        shareAmount: LEVEL_SHARE_AMOUNT
      }], { session });
      levelDoc = levelDoc[0];
    }

    for (const finisher of finishers) {
      const side = finisher.side;

      // Update left/right count
      await UserLevel.updateOne(
        { userId: parentId, level: levelDoc.level },
        { $inc: side === "left" ? { leftTreeCount: 1 } : { rightTreeCount: 1 } },
        { session }
      );

      // Compute partial earnings
      const threshold = levelDoc.threshold || computeThreshold(levelDoc.level);
      const earning = LEVEL_SHARE_AMOUNT / threshold;

      await UserEarning.updateOne(
        { userId: parentId, childId: finisher.childId, level: levelDoc.level },
        { $setOnInsert: { amount: earning, createdAt: new Date() } },
        { upsert: true, session }
      );

      // Update total & withdrawable earnings
      await User.updateOne(
        { _id: parentId },
        { $inc: { totalEarnings: earning, withdrawableEarnings: earning } },
        { session }
      );
    }

    // Check if parent can be promoted
    await tryPromoteUserLevel(parentId, levelDoc.level, session);

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

module.exports = { processRetroactiveEarnings };

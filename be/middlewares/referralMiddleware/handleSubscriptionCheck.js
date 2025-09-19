const mongoose = require("mongoose");
const User = require("../../models/userModels/userModel");
const DirectFinisher = require("../../models/userModels/userRefferalModels/directFinishersModel");
const UserEarning = require("../../models/userModels/userRefferalModels/referralEarnings");
const UserLevel = require("../../models/userModels/userRefferalModels/userReferralLevelModel");
const { computeThreshold } = require("../referralMiddleware/referralCount");
const { tryPromoteUserLevel } = require("../referralMiddleware/referralCount");

const LEVEL_SHARE_AMOUNT = 250;

/**
 * Process subscription completion for a child
 * Updates earnings for all eligible parents
 */
async function onUserSubscriptionComplete(childId) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Find all parent edges for this child
    const edges = await DirectFinisher.find({ childId }).session(session);

    for (const edge of edges) {
      const parentId = edge.parentId;
      const side = edge.side;

      // 2️⃣ Mark edge as finished
      edge.status = "finished";
      edge.completedAt = new Date();
      await edge.save({ session });

      // 3️⃣ Skip if parent is not subscribed
      const parent = await User.findById(parentId).select("subscription").lean();
      if (!parent.subscription?.isActive) continue;

      // 4️⃣ Ensure parent level exists
      let lvlDoc = await UserLevel.findOne({ userId: parentId, level: 1 }).session(session);
      if (!lvlDoc) {
        lvlDoc = await UserLevel.create([{
          userId: parentId,
          level: 1,
          tier: 1,
          leftTreeCount: 0,
          rightTreeCount: 0,
          threshold: computeThreshold(1),
          shareAmount: LEVEL_SHARE_AMOUNT
        }], { session });
        lvlDoc = lvlDoc[0];
      }

      // 5️⃣ Update left/right counts
      await UserLevel.updateOne(
        { userId: parentId, level: lvlDoc.level },
        { $inc: side === "left" ? { leftTreeCount: 1 } : { rightTreeCount: 1 } },
        { session }
      );

      // 6️⃣ Compute partial earnings
      const threshold = lvlDoc.threshold || computeThreshold(lvlDoc.level);
      const earning = LEVEL_SHARE_AMOUNT / threshold;

      await UserEarning.updateOne(
        { userId: parentId, childId, level: lvlDoc.level },
        { $setOnInsert: { amount: earning, createdAt: new Date() } },
        { upsert: true, session }
      );

      // 7️⃣ Update parent's total earnings
      await User.updateOne(
        { _id: parentId },
        { $inc: { totalEarnings: earning, withdrawableEarnings: earning } },
        { session }
      );

      // 8️⃣ Retroactive: check if parent has ancestors who are now eligible
      await processAncestors(parentId, lvlDoc.level, session);
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

/**
 * Recursively check ancestors for retroactive earnings
 */
async function processAncestors(userId, level, session) {
  const userDoc = await User.findById(userId).select("referredByUserId subscription").session(session);
  if (!userDoc?.referredByUserId) return;

  const parentId = userDoc.referredByUserId;

  const parent = await User.findById(parentId).select("subscription").lean();
  if (!parent.subscription?.isActive) return;

  // Count finished children for parent
  const finishedLeft = await DirectFinisher.countDocuments({ parentId, side: "left", status: "finished" }).session(session);
  const finishedRight = await DirectFinisher.countDocuments({ parentId, side: "right", status: "finished" }).session(session);

  const lvlDoc = await UserLevel.findOne({ userId: parentId, level }).session(session);
  if (!lvlDoc) return;

  // Update counts
  await UserLevel.updateOne(
    { userId: parentId, level },
    { $set: { leftTreeCount: finishedLeft, rightTreeCount: finishedRight } },
    { session }
  );

  // Compute partial earnings retroactively
  const threshold = lvlDoc.threshold || computeThreshold(level);
  const earning = LEVEL_SHARE_AMOUNT / threshold;

  await User.updateOne(
    { _id: parentId },
    { $inc: { totalEarnings: earning * (finishedLeft + finishedRight) / 2, withdrawableEarnings: earning * (finishedLeft + finishedRight) / 2 } },
    { session }
  );

  // Try promotion for parent
  await tryPromoteUserLevel(parentId, level, session);

  // Recursively process ancestors
  await processAncestors(parentId, level, session);
}

module.exports = { onUserSubscriptionComplete };

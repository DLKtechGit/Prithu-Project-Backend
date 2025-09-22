const mongoose = require("mongoose");
const User = require("../../models/userModels/userModel");
const ReferralEdge = require("../../models/userModels/userRefferalModels/refferalEdgeModle");
const DirectFinisher = require("../../models/userModels/userRefferalModels/directFinishersModel");
const UserLevel = require("../../models/userModels/userRefferalModels/userReferralLevelModel");
const UserEarning = require("../../models/userModels/userRefferalModels/referralEarnings");
const HeldReferral = require("../../models/userModels/userRefferalModels/heldUsers");

const LEVEL_SHARE_AMOUNT = 250;

function computePerSideThreshold(level) {
  const relativeLevel = ((level - 1) % 10) + 1;
  return Math.pow(2, relativeLevel - 1);
}
function computeTotalUsers(level) {
  return Math.pow(2, level);
}

async function getOrCreateUserLevel(userId, level, session = null) {
  const threshold = computePerSideThreshold(level);
  const tier = Math.ceil(level / 10);
  await UserLevel.updateOne(
    { userId, level },
    {
      $setOnInsert: {
        userId,
        level,
        tier,
        threshold,
        leftTreeCount: 0,
        rightTreeCount: 0,
        leftCarryOver: 0,
        rightCarryOver: 0,
        leftUsers: [],
        rightUsers: [],
        shareAmount: LEVEL_SHARE_AMOUNT,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true, session }
  );
  return UserLevel.findOne({ userId, level }).session(session);
}

async function onSubscriptionActivated(childId) {
  if (!childId) throw new Error("childId required");

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const edges = await ReferralEdge.find({ childId }).session(session);
    for (const edge of edges) {
      await ReferralEdge.updateOne(
        { _id: edge._id },
        { $set: { status: "finished", completedAt: new Date(), updatedAt: new Date() } },
        { session }
      );
      await DirectFinisher.updateOne(
        { parentId: edge.parentId, childId },
        {
          $set: {
            parentId: edge.parentId,
            childId,
            side: edge.side,
            status: "finished",
            level: edge.level,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true, session }
      );
    }

    let currentChild = await User.findById(childId).session(session);
    if (!currentChild) {
      await session.commitTransaction();
      session.endSession();
      return;
    }

    let ancestorId = currentChild.referredByUserId;
    let levelUp = 1;

    while (ancestorId && levelUp <= 10) {
      const ancestor = await User.findById(ancestorId).session(session);
      if (!ancestor) break;

      // find ancestor->child side
      let walker = currentChild;
      let immediateChildUnderAncestor = null;
      while (
        walker &&
        walker.referredByUserId &&
        walker.referredByUserId.toString() !== ancestorId.toString()
      ) {
        walker = await User.findById(walker.referredByUserId).session(session);
      }
      if (walker && walker.referredByUserId?.toString() === ancestorId.toString()) {
        immediateChildUnderAncestor = walker._id;
      }
      let side = null;
      if (immediateChildUnderAncestor) {
        const ancestorEdge = await ReferralEdge.findOne({
          parentId: ancestorId,
          childId: immediateChildUnderAncestor,
        }).session(session);
        if (ancestorEdge) side = ancestorEdge.side;
      }

      if (ancestor.subscription?.isActive) {
        const userLevelDoc = await getOrCreateUserLevel(ancestorId, levelUp, session);

        if (side === "left") {
          if (!userLevelDoc.leftUsers.some((id) => id.toString() === childId.toString())) {
            await UserLevel.updateOne(
              { userId: ancestorId, level: levelUp },
              { $push: { leftUsers: childId }, $inc: { leftTreeCount: 1 } },
              { session }
            );
          }
        } else if (side === "right") {
          if (!userLevelDoc.rightUsers.some((id) => id.toString() === childId.toString())) {
            await UserLevel.updateOne(
              { userId: ancestorId, level: levelUp },
              { $push: { rightUsers: childId }, $inc: { rightTreeCount: 1 } },
              { session }
            );
          }
        }

        const totalUsers = computeTotalUsers(levelUp);
        const earningAmt = parseFloat((LEVEL_SHARE_AMOUNT / totalUsers).toFixed(6));
        await UserEarning.create(
          [{ userId: ancestorId, fromUserId: childId, level: levelUp, amount: earningAmt, isPartial: true }],
          { session }
        );
        await User.updateOne(
          { _id: ancestorId },
          { $inc: { totalEarnings: earningAmt, withdrawableEarnings: earningAmt } },
          { session }
        );

        const updatedLevel = await UserLevel.findOne({
          userId: ancestorId,
          level: levelUp,
        }).session(session);
        const perSide = updatedLevel.threshold;

        if (updatedLevel.leftTreeCount >= perSide && updatedLevel.rightTreeCount >= perSide) {
          const nextLevel = levelUp + 1;

          // ✅ Pull held referrals for this ancestor at this level
          const held = await HeldReferral.find({ parentId: ancestorId, level: levelUp }).session(
            session
          );
          for (const h of held) {
            const targetSide = h.side;
            await UserLevel.updateOne(
              { userId: ancestorId, level: nextLevel },
              {
                $push:
                  targetSide === "left"
                    ? { leftUsers: h.userId }
                    : { rightUsers: h.userId },
                $inc:
                  targetSide === "left"
                    ? { leftTreeCount: 1 }
                    : { rightTreeCount: 1 },
              },
              { upsert: true, session }
            );
          }
          await HeldReferral.deleteMany({ parentId: ancestorId, level: levelUp }).session(session);

          await getOrCreateUserLevel(ancestorId, nextLevel, session);
          await User.updateOne(
            { _id: ancestorId },
            {
              $set: {
                currentLevel: nextLevel,
                currentTier: Math.ceil(nextLevel / 10),
                lastPromotedAt: new Date(),
                isTierComplete: nextLevel % 10 === 0,
              },
            },
            { session }
          );
        } else {
          // ❌ Not balanced → hold this child
          await HeldReferral.updateOne(
            { parentId: ancestorId, userId: childId, level: levelUp },
            { $setOnInsert: { side, createdAt: new Date() } },
            { upsert: true, session }
          );
        }

        if (levelUp === 1) {
          const directSubscribed = await DirectFinisher.countDocuments({
            parentId: ancestorId,
            status: "finished",
          }).session(session);
          await User.updateOne(
            { _id: ancestorId },
            { $set: { directSubscribedCount: directSubscribed } },
            { session }
          );
          if (directSubscribed >= 2 && ancestor.referralCodeIsValid) {
            await User.updateOne(
              { _id: ancestorId },
              { $set: { referralCodeIsValid: false } },
              { session }
            );
          }
        }
      }

      currentChild = ancestor;
      ancestorId = ancestor.referredByUserId;
      levelUp++;
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    console.error("onSubscriptionActivated error:", err);
    throw err;
  } finally {
    session.endSession();
  }
}

module.exports = {
  computePerSideThreshold,
  computeTotalUsers,
  onSubscriptionActivated,
  getOrCreateUserLevel,
};

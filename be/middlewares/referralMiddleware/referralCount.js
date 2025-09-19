/**
 * referralService.js
 *
 * Exposes:
 *  - placeReferral({ parentId, childId })
 *  - onSubscriptionActivated(childId)
 *  - computeThreshold(level)
 *
 * Rules implemented:
 * - Max 2 direct referrals per parent (left/right)
 * - When child subscription activates: if parent subscription active, mark edge finished, credit earning (level share / threshold)
 * - Partial earnings allowed per child (earning = levelShare / threshold)
 * - Promotion occurs when both sides meet threshold; overflow/carry over forwarded to next level
 */

const mongoose = require("mongoose");
const ReferralEdge = require("../../models/userModels/userRefferalModels/refferalEdgeModle");
const UserLevel = require("../../models/userModels/userRefferalModels/userReferralLevelModel");
const UserEarning = require("../../models/userModels/userRefferalModels/referralEarnings");
const User = require("../../models/userModels/userModel");

const LEVEL_SHARE_AMOUNT = 250; // ₹250 fixed

function computeThreshold(level) {
  const relativeLevel = ((level - 1) % 10) + 1;
  if (relativeLevel === 1) return 2;
  return Math.pow(2, relativeLevel);
}

async function getOrCreateLevel(userId, level, session = null) {
  const threshold = computeThreshold(level);
  await UserLevel.updateOne(
    { userId, level },
    { $setOnInsert: {
        userId, level, tier: Math.ceil(level/10), threshold,
        leftTreeCount:0, rightTreeCount:0, leftCarryOver:0, rightCarryOver:0,
        shareAmount: LEVEL_SHARE_AMOUNT, createdAt:new Date(), updatedAt:new Date()
      }
    },
    { upsert: true, session }
  );
  return UserLevel.findOne({ userId, level }).session(session);
}

/**
 * placeReferral:
 * Idempotent placement. Ensures a parent has at most 2 direct referrals (left + right).
 */
async function placeReferral({ parentId, childId }) {
  if (!parentId || !childId) throw new Error("parentId and childId required");
  if (parentId.toString() === childId.toString()) throw new Error("cannot be your own referrer");

  // ensure up-to-date snapshot and atomic decision
  return await mongoose.connection.transaction(async (session) => {
    // Check existing edge
    const existing = await ReferralEdge.findOne({ parentId, childId }).session(session);
    if (existing) return existing; // idempotent

    // Count existing children to determine side
    const children = await ReferralEdge.find({ parentId }).session(session);
    const leftExists = children.some(c => c.side === "left");
    const rightExists = children.some(c => c.side === "right");

    if (leftExists && rightExists) {
      throw new Error("Parent already has two direct referrals");
    }

    const side = !leftExists ? "left" : "right";
    const parentLevel = 1; // new referral placed at parent's active placement level; default 1
    const tier = Math.ceil(parentLevel / 10);

    const edge = new ReferralEdge({ parentId, childId, side, level: parentLevel, tier, status: "incomplete" });
    await edge.save({ session });

    // store child's side under parent on user (optional)
    await User.updateOne({ _id: childId }, { $set: { sideUnderParent: side, referredByUserId: parentId } }, { session });

    return edge;
  });
}

/**
 * onSubscriptionActivated(childId)
 * Called when a user completes subscription activation.
 * For each parent edge where this child is a direct child, credit earning if parent is active.
 */
async function onSubscriptionActivated(childId) {
  if (!childId) throw new Error("childId required");

  // Find the immediate parent edges for this child
  const edges = await ReferralEdge.find({ childId, status: "incomplete" }).lean();
  if (!edges || edges.length === 0) return;

  for (const edge of edges) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const parent = await User.findById(edge.parentId).session(session);
      if (!parent) {
        await session.abortTransaction();
        continue;
      }

      // Earnings count only if parent is subscribed (parent must be active for earnings to credit)
      if (!parent.subscription?.isActive) {
        // Do nothing now; when parent subscribes later we don't retroactively credit
        // (Alternate design: on parent subscribe, scan children and credit — but here we follow rule: earnings credited when child subscribes if parent active)
        await session.abortTransaction();
        continue;
      }

      // Get the userLevel doc for parent's current level
      const levelNum = parent.currentLevel || 1;
      let lvlDoc = await getOrCreateLevel(parent._id, levelNum, session);

      // Mark edge finished
      await ReferralEdge.updateOne({ _id: edge._id }, {
        $set: { status: "finished", completedAt: new Date(), updatedAt: new Date() }
      }, { session });

      // Increment the user's left/right count for this level
      const sideField = edge.side === "left" ? "leftTreeCount" : "rightTreeCount";
      await UserLevel.updateOne({ userId: parent._id, level: lvlDoc.level }, { $inc: { [sideField]: 1 } }, { session });

      // Re-fetch level doc after increment
      lvlDoc = await UserLevel.findOne({ userId: parent._id, level: lvlDoc.level }).session(session);

      // Calculate earning amount (split by threshold)
      const threshold = lvlDoc.threshold || computeThreshold(lvlDoc.level);
      const earningAmt = parseFloat((LEVEL_SHARE_AMOUNT / threshold).toFixed(2)); // partial allowed

      // Log earning and update user balances
      await UserEarning.create([{ userId: parent._id, childId, level: lvlDoc.level, amount: earningAmt }], { session });
      await User.updateOne({ _id: parent._id }, { $inc: { totalEarnings: earningAmt, withdrawableEarnings: earningAmt } }, { session });

      // handle overflow/carry over: if side counts > threshold, carry to next level
      let left = lvlDoc.leftTreeCount;
      let right = lvlDoc.rightTreeCount;
      if (left > threshold || right > threshold) {
        const overflowLeft = Math.max(0, left - threshold);
        const overflowRight = Math.max(0, right - threshold);

        // clamp current to threshold
        await UserLevel.updateOne({ userId: parent._id, level: lvlDoc.level }, {
          $set: { leftTreeCount: Math.min(left, threshold), rightTreeCount: Math.min(right, threshold) }
        }, { session });

        // create/ensure next level and add overflow to next level counts
        const nextLevel = lvlDoc.level + 1;
        await getOrCreateLevel(parent._id, nextLevel, session);
        const nextSideUpdate = {};
        if (overflowLeft) nextSideUpdate.leftTreeCount = overflowLeft;
        if (overflowRight) nextSideUpdate.rightTreeCount = overflowRight;
        if (Object.keys(nextSideUpdate).length) {
          await UserLevel.updateOne({ userId: parent._id, level: nextLevel }, { $inc: nextSideUpdate }, { session });
        }
      }

      // Try promotion if both sides reached threshold
      await tryPromoteUserLevel(parent._id, lvlDoc.level, session);

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      console.error("onSubscriptionActivated error:", err);
      // continue to next edge
    } finally {
      session.endSession();
    }
  }
}

/**
 * tryPromoteUserLevel(userId, level, externalSession)
 * Promotes user to next level if both left & right counts >= threshold.
 * Also triggers recursive promotion for the referrer of this user (upwards).
 */
async function tryPromoteUserLevel(userId, level, externalSession = null) {
  const session = externalSession || await mongoose.startSession();
  let createdLocal = false;
  try {
    if (!externalSession) { session.startTransaction(); createdLocal = true; }

    const lvl = await UserLevel.findOne({ userId, level }).session(session);
    if (!lvl) {
      if (createdLocal) { await session.commitTransaction(); session.endSession(); }
      return;
    }

    const left = lvl.leftTreeCount;
    const right = lvl.rightTreeCount;
    const threshold = lvl.threshold;

    if (left >= threshold && right >= threshold) {
      const nextLevel = level + 1;
      await getOrCreateLevel(userId, nextLevel, session);

      const newTier = Math.ceil(nextLevel / 10);
      await User.updateOne({ _id: userId }, {
        $set: {
          currentLevel: nextLevel,
          currentTier: newTier,
          lastPromotedAt: new Date(),
          isTierComplete: (nextLevel % 10 === 0)
        }
      }, { session });

      // When promoted, if there were carryOver counts already in next level they remain (we already add overflow earlier)
      // Trigger promotion check for the user's referrer (upstream), at the same "level" as this user's promotion was for.
      const userDoc = await User.findById(userId).select("referredByUserId").session(session);
      if (userDoc?.referredByUserId) {
        // parent of this user may need to be promoted for the same level number
        await tryPromoteUserLevel(userDoc.referredByUserId, level, session);
      }
    }

    if (createdLocal) { await session.commitTransaction(); session.endSession(); }
  } catch (err) {
    if (createdLocal) { await session.abortTransaction(); session.endSession(); }
    throw err;
  }
}

module.exports = {
  computeThreshold,
  placeReferral,
  onSubscriptionActivated,
  tryPromoteUserLevel
};

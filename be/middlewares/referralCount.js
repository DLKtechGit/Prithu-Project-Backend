const mongoose = require("mongoose");
const User = require("../models/userModels/userModel");
const ReferralEdge = require("../models/userModels/userRefferalModels/refferalEdgeModle");
const UserLevel = require("../models/userModels/userRefferalModels/userReferralLevelModel");
const DirectFinisher = require("../models/userModels/userRefferalModels/directReferralFinishers");
const UserEarning = require("../models/userModels/userRefferalModels/referralEarnings");
const { computeThreshold } = require("../middlewares/threshHold");

const LEVEL_SHARE_AMOUNT = 250;

async function getOrCreateLevel(userId, level, session = null) {
  const threshold = computeThreshold(level);
  await UserLevel.updateOne(
    { userId, level },
    { $setOnInsert: {
      userId, level, tier: Math.ceil(level/10), leftTreeCount:0, rightTreeCount:0,
      threshold, shareAmount: LEVEL_SHARE_AMOUNT, createdAt:new Date(), updatedAt:new Date()
    }},
    { upsert:true, session }
  );
  return UserLevel.findOne({ userId, level }).session(session);
}

async function getActivePlacementLevel(userId, session=null) {
  const lvl = await UserLevel.find({ userId }).sort({level:-1}).limit(1).session(session);
  return (lvl && lvl.length) ? lvl[0].level : 1;
}

async function placeReferral({parentId, childId}) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    let level = await getActivePlacementLevel(parentId, session);
    let lvlDoc = await getOrCreateLevel(parentId, level, session);
    const side = (lvlDoc.leftTreeCount <= lvlDoc.rightTreeCount) ? "left":"right";

    await ReferralEdge.updateOne({ parentId, childId },
      { $setOnInsert:{ parentId, childId, level, side, createdAt:new Date() } },
      { upsert:true, session }
    );

    await DirectFinisher.updateOne({ parentId, childId },
      { $setOnInsert:{ parentId, childId, side, status:"incomplete", createdAt:new Date() },
        $set:{ updatedAt:new Date() }
      }, { upsert:true, session }
    );

    await session.commitTransaction();
  } catch(err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

async function onUserSubscriptionComplete(childId) {
  const edges = await DirectFinisher.find({ childId, status:"incomplete" });
  for (const edge of edges) {
    const parentId = edge.parentId;
    const side = edge.side;

    edge.status="finished";
    edge.completedAt = new Date();
    await edge.save();

    const parent = await User.findById(parentId).select("subscription").lean();
    if(!parent.subscription?.isActive) continue;

    let lvlDoc = await UserLevel.findOne({ userId: parentId, level:1 });
    if(!lvlDoc) lvlDoc = await getOrCreateLevel(parentId, 1);

    await UserLevel.updateOne({ userId: parentId, level:lvlDoc.level },
      { $inc: side==="left" ? {leftTreeCount:1}:{rightTreeCount:1} }
    );

    const threshold = lvlDoc.threshold || computeThreshold(lvlDoc.level);
    const earning = LEVEL_SHARE_AMOUNT / threshold;

    await UserEarning.create({ userId:parentId, childId, level:lvlDoc.level, amount:earning });
    await User.updateOne({_id:parentId}, {$inc:{totalEarnings:earning, withdrawableEarnings: earning}});

    await tryPromoteUserLevel(parentId, lvlDoc.level);
  }
}

async function tryPromoteUserLevel(userId, level, externalSession=null) {
  const session = externalSession || (await mongoose.startSession());
  let createdLocalSession = false;
  try {
    if(!externalSession) { session.startTransaction(); createdLocalSession=true; }

    const lvl = await UserLevel.findOne({ userId, level }).session(session);
    if(!lvl) return;

    const finishedLeft = await DirectFinisher.countDocuments({parentId:userId, side:"left", status:"finished"}).session(session);
    const finishedRight = await DirectFinisher.countDocuments({parentId:userId, side:"right", status:"finished"}).session(session);

    if(finishedLeft >= lvl.threshold && finishedRight >= lvl.threshold) {
      const nextLevel = level + 1;
      await getOrCreateLevel(userId, nextLevel, session);
      const newTier = Math.ceil(nextLevel/10);

      await User.updateOne({_id:userId}, { $set:{
        currentLevel: nextLevel,
        currentTier: newTier,
        lastPromotedAt: new Date(),
        isTierComplete: nextLevel % 10 ===0
      }},{ session });

      const userDoc = await User.findById(userId).select("referredByUserId").session(session);
      if(userDoc?.referredByUserId){
        await tryPromoteUserLevel(userDoc.referredByUserId, level, session);
      }
    }

    if(createdLocalSession){ await session.commitTransaction(); session.endSession(); }
  } catch(err){
    if(createdLocalSession){ await session.abortTransaction(); session.endSession(); }
    throw err;
  }
}

module.exports = { placeReferral, onUserSubscriptionComplete, tryPromoteUserLevel, getOrCreateLevel };

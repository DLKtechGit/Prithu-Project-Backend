const UserLevel = require("../models/userModels/userReferralLevelModel");
const User = require("../models/userModels/userModel");

exports.referralStructure = async (referralCode, newUserId) => {
  console.log("Starting referral structure update");

  try {
    if (!referralCode) return { success: false, message: "Referral code missing" };

    const referrerUser = await User.findOne({ referralCode });
    if (!referrerUser) return { success: false, message: "Invalid referral code" };

    // Get latest level document for the referrer
    let latestLevel = await UserLevel.findOne({ userId: referrerUser._id }).sort({ userLevel: -1 });

    if (!latestLevel) {
      // No level exists → create level 1
      latestLevel = new UserLevel({
        userId: referrerUser._id,
        userLevel: 1,
        levelLimit: 1,
        tier: 1,
        referringPeople: [newUserId],
      });
      await latestLevel.save();
      console.log(`Created level 1 for user ${referrerUser._id}`);
    } else {
      // Add new user to current level
      latestLevel.referringPeople.push(newUserId);

      // Check if threshold reached to create new level
      if (latestLevel.referringPeople.length >= 2 ** latestLevel.userLevel) {
        const newLevelNum = latestLevel.userLevel + 1;
        const newLevelDoc = new UserLevel({
          userId: referrerUser._id,
          userLevel: newLevelNum,
          levelLimit: latestLevel.levelLimit + 1,
          tier: Math.ceil(newLevelNum / 10),
          referringPeople: [], // start fresh
        });
        await newLevelDoc.save();
        console.log(`Created level ${newLevelNum} for user ${referrerUser._id}`);
      }

      await latestLevel.save();
    }

    // Loop up the referral chain
    let currentReferrerId = referrerUser.referredByUserId;
    while (currentReferrerId) {
      const parentUser = await User.findById(currentReferrerId);
      if (!parentUser) break;

      // Increment referral count
      parentUser.referralCount = (parentUser.referralCount || 0) + 1;
      await parentUser.save();

      let parentLevel = await UserLevel.findOne({ userId: parentUser._id }).sort({ userLevel: -1 });

      if (!parentLevel) {
        // Create level 1 if missing
        parentLevel = new UserLevel({
          userId: parentUser._id,
          userLevel: 1,
          levelLimit: 1,
          tier: 1,
          referringPeople: [newUserId],
        });
        await parentLevel.save();
      } else {
        // Push user to current level
        parentLevel.referringPeople.push(newUserId);

        // Check threshold
        if (parentLevel.referringPeople.length >= parentLevel.userLevel**parentLevel.levelLimit) {
          const newLevelNum = parentLevel.userLevel + 1;
          const newLevelDoc = new UserLevel({
            userId: parentUser._id,
            userLevel: newLevelNum,
            levelLimit: parentLevel.levelLimit + 1,
            tier: Math.ceil(newLevelNum / 10),
            referringPeople: [], // start fresh
          });
          await newLevelDoc.save();

          // Unlock referral code at level 100 / tier 10
          if (newLevelNum >= 100 && Math.ceil(newLevelNum / 10) >= 10) {
            parentUser.referralCodeValid = true;
            await parentUser.save();
            console.log(`Referral code unlocked for user ${parentUser._id}`);
          }
        }

        await parentLevel.save();
      }

      currentReferrerId = parentUser.referredByUserId;
    }

    return { success: true, message: "Referral structure updated successfully" };
  } catch (error) {
    console.error("Error in referralStructure:", error);
    return { success: false, message: "Server error" };
  }
};

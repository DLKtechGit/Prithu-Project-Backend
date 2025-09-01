const UserLevel = require("../models/userModels/userReferralLevelModel");
const User=require("../models/userModels/userModel");


// exports.referralStructure = async (referralCode, newUserId) => {
//   try {
//     if (!referralCode) return { success: false, message: "Referral code missing" };

//     const referrerUser = await User.findOne({ referralCode });
//     if (!referrerUser) return { success: false, message: "Invalid referral code" };

//     // Handle user levels
//     let userLevelUpdate = await UserLevel.findOne({ userId: referrerUser._id }).sort({ level: -1 });
//     if (userLevelUpdate) {
//         console.log("Existing user level found, updating level");
//       userLevelUpdate.referringPeople.push(newUserId);
//       await userLevelUpdate.save();
//     } else {
//         console.log("No user level found, creating new level");
//       // No level exists → create level 1
//       const newUserLevel = new UserLevel({
//         userId: referrerUser._id,
//         userLevel: 1,
//         levelLimit: 1,
//         tier: 1,
//         referringPeople: [newUserId],
//       });
//       await newUserLevel.save();
//     }

//     // Loop up the referral chain
//     let currentReferrerId = referrerUser.referredByUserId;
//     console.log("starting referral chain loop");
//     while (currentReferrerId) {
//       const parentUser = await User.findById(currentReferrerId);
//       if (!parentUser) break;

//       const parentLevel = await UserLevel.findOne({ userId: parentUser._id }).sort({ level: -1 });

//       // Increment referral count
//       parentUser.referralCount = (parentUser.referralCount || 0) + 1;
//       await parentUser.save();

//       // Check if new level is needed
//       if (parentLevel && parentUser.referralCount >= parentLevel.level * parentLevel.userLimit) {
//         const newLevel = parentLevel.level + 1;
//         const newUserLimit = parentLevel.userLimit + 1;
//         const newTier = Math.ceil(newLevel / 10);

//         const newLevelDoc = new UserLevel({
//           userId: parentUser._id,
//           level: newLevel,
//           userLimit: newUserLimit,
//           tier: newTier,
//           referringPeople: [newUserId],
//         });
//         await newLevelDoc.save();

//         // Unlock referral code at level 100 / tier 10
//         if (newLevel >= 100 && newTier >= 10) {
//           parentUser.referralCodeValid = true;
//           await parentUser.save();
//           console.log(`Referral code unlocked for user ${parentUser._id}`);
//         }
//       }

//       currentReferrerId = parentUser.referredByUserId;
//     }

//     return { success: true, message: "Referral structure updated successfully" };
//   } catch (error) {
//     console.error("Error in referralStructure:", error);
//     return { success: false, message: "Server error" };
//   }
// };

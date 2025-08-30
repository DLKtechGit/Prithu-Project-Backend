// const userLevelSchema=require('../models/userModels/userReferralLevelModel')
// const User = require("../models/userModels/userModel");

// exports.refferalStructure=async(referralCode)=>{
//     // RefferalCode Validation
// if (referralCode) {
//   const referringUser = await User.findOne({ referralCode })
       
//   if (referringUser.referralCodeUsageLimit >= 2) 
//        {
//    referringUser.referralCodeUsageLimt += 1;
//     referringUser.referralcount = (referringUser.referralcount || 0) + 1;
//        }else
//         {
//    referringUser.referralCodeIsValid = false;
//        }

//  const userLevelUpdate = await userLevelSchema.findOne({ userId: referringUser._id });

// if (userLevelUpdate) {
//   // If userLevel document exists, just push the referring user
//   userLevelUpdate.referringPeople.push(referringUser._id);
//   await userLevelUpdate.save();
// } else {
//   // If no userLevel document exists
//   if (referringUser.referredBy === null) {
//     const newUserLevel = new userLevelSchema({
//       userId: referringUser._id,
//       level: 1,           // Initialize level 1
//       userLimit: 1,       // Initialize user limit 1
//       referringPeople: [referringUser._id] // Push the referring user
//     });

//     await newUserLevel.save();
//   }
//   if(referringUser.referredBy !== null){

//     const referred
//   }

// }
// }
// }
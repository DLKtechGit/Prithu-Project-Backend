
exports.refferalStructure=async(referralCode)=>{

    let referredByUserId= null;
    // RefferalCode Validation
if (referralCode) {
  // Find user with this referral code who is still valid for referral usage


  
    

      const referringUser = await User.findOne({ referralCode });
      
        if (!referringUser || !referringUser.referralCodeIsValid) {
            return res.status(400).json({ message: 'Referral code is expired or invalid' });
        }

          if (referringUser.referralcount >= 2) { // 2 is your limit
    // Optionally, mark referralCodeIsValid as false to make code invalid
    referringUser.referralCodeIsValid = false;
    await referringUser.save();

    return res.status(400).json({ message: 'Referral usage limit reached' });
  }

  if(referringUser!==null && referringUser!==undefined) {

      for (let i = 0; i < 1; i++) {

      // Check current referral count

   // Increment referral count atomically
  referringUser.referralcount = (referringUser.referralcount || 0) + 1;
  await referringUser.save();

  const referredBy = await User.findById({
    _id: referringUser._id,
  })

  if(referredBy)
  {
  referringUser=referredBy;
}else
{
    referringUser=null;
}
      }
  }


  
 

referredByUserId  = referringUser._id;
  // Proceed with your referral reward 
}
return  referredByUserId;

}
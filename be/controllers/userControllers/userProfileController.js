const UserProfile =require('../../models/userModels/userProfileModel')

exports.userProfileDetailUpdate=async (req,res)=>
{
    const{profileImage,phoneNumber,bio,displayName}=req.body;
    const {userId}=req.params.id;

    


    const userSave= new UserProfile
    {
        userId,
        profileImage,
        phoneNumber,
        bio,
        displayName
    }
    
}
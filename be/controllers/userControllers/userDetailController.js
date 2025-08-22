const { param } = require("../../roots/root")
const Users = require("../../models/userModel")

exports.getUserdetailWithID = async (req, res) => {
  try {
    const userId = req.params.id; 
    const user = await Users.findById(userId); 
    if (!user) {
      return res.status(400).json({ message: "User Details not Found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: "Cannot Fetch User Details", error: err });
  }
};

// exports.getAllUserDetails=async (req,res)
// {
//   try{
//       const allUsers=await Users.find()
//       if(!allUsers)res.status(400).json({ message: "Users Details not Found" });
  
//     res.status(200).json({ allUsers });
//   } catch (err) {
//     res.status(500).json({ message: "Cannot Fetch User Details", error: err });
//   }

// }

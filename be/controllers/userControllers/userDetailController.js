const { param } = require("../../roots/root")
const Users = require("../../models/userModels/userModel")
const { processPayment } =require( "../../middlewares/subcriptionMiddlewares/paymentHelper");

exports.getUserdetailWithId = async (req, res) => {
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

 exports.getAllUserDetails=async (req,res)=>
  
{
  console.log('working')
  try{
      const allUsers=await Users.find()
      if(!allUsers)res.status(400).json({ message: "Users Details not Found" });
  
    res.status(200).json({ allUsers });
  } catch (err) {
    res.status(500).json({ message: "Cannot Fetch User Details", error: err });
  }

}




exports.dummyPayment = async (req, res) => {
  const { subscriptionId, result ,userId} = req.body; 
  if (!userId || !subscriptionId || !result) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const subscription = await processPayment(userId, subscriptionId, result);
    res.status(200).json({ message: "Payment processed", subscription });
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
};





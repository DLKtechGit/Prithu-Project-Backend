
const Creators = require("../../models/creatorModel")


exports.getCreatorDetailWithId = async (req, res) => {
  try {
    const creatorId = req.params.id; 
    const creators = await Creators.findById(creatorId); 
    if (!creators) {
      return res.status(400).json({ message: "Creator Details not Found" });
    }

    res.status(200).json({ creators });
  } catch (err) {
    res.status(500).json({ message: "Cannot Fetch Creator Details", error: err });
  }
};

 exports.getAllCreatorDetails=async (req,res)=>
  
{
  console.log('working')
  try{
      const allCreators=await Creators.find()
      if(!allCreators)res.status(400).json({ message: "Creators Details not Found" });

    res.status(200).json({ allCreators });
  } catch (err) {
    res.status(500).json({ message: "Cannot Fetch Creator Details", error: err });
  }

}










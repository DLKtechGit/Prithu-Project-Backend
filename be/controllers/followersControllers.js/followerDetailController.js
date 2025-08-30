


exports.followCreator = async (req, res) => {
  try {
    const userId = req.userId;
    const creatorId = req.params.creatorId;

    if (userId === creatorId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const creator = await User.findById(creatorId);
    if (!creator || creator.role !== "creator") {
      return res.status(404).json({ message: "Creator not found" });
    }

    // Create follow relation
    await Follower.create({ userId, creatorId });

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already following" });
    }
    res.status(500).json({ message: "Server error", error });
  }
};

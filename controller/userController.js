import User from "../model/userModel.js";
import Policy from "../model/policyModel.js";

const getPolicy = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const policies = await Policy.aggregate([
      { $match: { userId: user._id } },

      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "lobs",
          localField: "companyCollectionId",
          foreignField: "_id",
          as: "lobDetails",
        },
      },
    ]);

    res.status(200).json({ policies });
  } catch (error) {
    console.error("Error searching policies by username:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { getPolicy };
const UserSubscription =require ("../../models/subcriptionModels/userSubscreptionModel.js");
const SubscriptionPlan =require("../../models/subcriptionModels/subscriptionPlanModel.js");
const { assignPlanToUser }=require( "../../middlewares/subcriptionMiddlewares/assignPlanToUserHelper.js");

exports.subscribePlan = async (req, res) => {
  const { planId } = req.body;
  if (!planId) {
    return res.status(400).json({ message: "Plan ID is required" });
  }
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const subscription = await assignPlanToUser(userId, planId);
    res.status(200).json({ message: "Plan assigned", subscription });
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
};


exports.cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.body;
if (!subscriptionId) {
    return res.status(400).json({ message: "Subscription ID is required" });
  }
  const subscription = await UserSubscription.findById(subscriptionId);
  if(!subscription) return res.status(404).json({ message: "Subscription not found" });

  subscription.isActive = false;
  await subscription.save();
  res.status(200).json({ message: "Subscription cancelled" });
};


exports.getAllSubscriptionPlans = async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json({ plans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

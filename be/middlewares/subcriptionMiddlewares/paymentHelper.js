const UserSubscription =require("../../models/subcriptionModels/userSubscreptionModel");
const SubscriptionPlan =require("../../models/subcriptionModels/subscriptionPlanModel");

exports.processPayment = async (userId, subscriptionId, paymentResult) => {

  const subscription = await UserSubscription.findById(subscriptionId);
  if(!subscription) throw new Error("Subscription not found");

  if(paymentResult === "success") {
    subscription.isActive = true;
    subscription.paymentStatus = "success";

    // Optional: extend endDate if user pays before end
    const today = new Date();
    if(today < subscription.endDate){
      const plan = await SubscriptionPlan.findById(subscription.planId);
      subscription.endDate = new Date(today.setDate(today.getDate() + plan.durationDays));
    }

  } else if(paymentResult === "failed") {
    subscription.isActive = false;
    subscription.paymentStatus = "failed";
  }

  await subscription.save();
  return subscription;
};

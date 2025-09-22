const User = require("../../models/userModels/userModel");
const UserSubscription = require("../../models/subcriptionModels/userSubscreptionModel");
const SubscriptionPlan = require("../../models/subcriptionModels/subscriptionPlanModel");
const { assignPlanToUser } = require("../../middlewares/subcriptionMiddlewares/assignPlanToUserHelper");
const { onSubscriptionActivated } = require("../referralMiddleware/referralCount");

exports.processPayment = async (userId, subscriptionId, paymentResult) => {
  // find or create subscription record (your existing logic)
  let subscription = null;
  if (subscriptionId) subscription = await UserSubscription.findById(subscriptionId);
  if (!subscription) subscription = await assignPlanToUser(userId, subscriptionId);
  if (!subscription) throw new Error("Subscription could not be created or found");

  if (paymentResult === "success") {
    subscription.isActive = true;
    subscription.paymentStatus = "success";

    const today = new Date();
    if (!subscription.startDate) subscription.startDate = today;

    const plan = await SubscriptionPlan.findById(subscription.planId);
    const durationMs = (plan && plan.durationDays) ? plan.durationDays * 24 * 60 * 60 * 1000 : (30 * 24 * 60 * 60 * 1000);

    if (!subscription.endDate || today >= subscription.endDate) {
      subscription.endDate = new Date(today.getTime() + durationMs);
    } else {
      subscription.endDate = new Date(subscription.endDate.getTime() + durationMs);
    }

    await subscription.save();

    // 1) update user's subscription and make referralCode valid
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "subscription.isActive": true,
          "subscription.startDate": subscription.startDate,
          "subscription.endDate": subscription.endDate,
          "subscription.updatedAt": new Date(),
          referralCodeIsValid: true // code becomes active now
        }
      }
    );

    // 2) Trigger referral/earning logic for this subscribing user
    await onSubscriptionActivated(userId);

    return subscription;
  } else if (paymentResult === "failed") {
    subscription.isActive = false;
    subscription.paymentStatus = "failed";
    await subscription.save();
    await User.findByIdAndUpdate(userId, { $set: { "subscription.isActive": false, referralCodeIsValid: false } });
    return subscription;
  } else {
    subscription.paymentStatus = "pending";
    await subscription.save();
    return subscription;
  }
};

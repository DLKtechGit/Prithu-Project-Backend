const UserSubscription = require("../../models/subcriptionModels/userSubscreptionModel");
const SubscriptionPlan = require("../../models/subcriptionModels/subscriptionPlanModel");
const { assignPlanToUser } = require("../../middlewares/subcriptionMiddlewares/assignPlanToUserHelper");
const User = require("../../models/userModels/userModel");
const {onSubscriptionActivated}=require('../../middlewares/referralMiddleware/referralCount');

exports.processPayment = async (userId, subscriptionId, paymentResult) => {
  let subscription = null;
  console.log({ userId, subscriptionId, paymentResult });

  // 1️⃣ Find subscription by ID if provided
  if (subscriptionId) {
    subscription = await UserSubscription.findById(subscriptionId);
  }

  // 2️⃣ If subscription doesn’t exist, assign a new plan
  if (!subscription) {
    subscription = await assignPlanToUser(userId, subscriptionId);
  }

  if (!subscription) throw new Error("Subscription could not be created or found");

  // 3️⃣ Handle payment result
  if (paymentResult === "success") {
    subscription.isActive = true;
    subscription.paymentStatus = "success";

    // Update subscription dates
    const today = new Date();
    if (!subscription.startDate) subscription.startDate = today;

    if (!subscription.endDate || today >= subscription.endDate) {
      // fresh subscription
      const plan = await SubscriptionPlan.findById(subscription.planId);
      subscription.endDate = new Date(today.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    } else {
      // extend if already active
      const plan = await SubscriptionPlan.findById(subscription.planId);
      if (plan) {
        const newEnd = new Date(subscription.endDate);
        newEnd.setDate(newEnd.getDate() + plan.durationDays);
        subscription.endDate = newEnd;
      }
    }

    // If logic = "a user gets a valid referral code once subscribed"
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          "subscription.isActive": true,
           referralCodeIsValid: true,
          "subscription.startDate": subscription.startDate,
          "subscription.endDate": subscription.endDate,
          "subscription.updatedAt": new Date()
        }
      },
      { new: true }
    );

    // Trigger referral/earning logic
    await onSubscriptionActivated(userId);

  } else if (paymentResult === "failed") {
    subscription.isActive = false;
    subscription.paymentStatus = "failed";

    await User.findByIdAndUpdate(
      userId,
      { $set: { "subscription.isActive": false, referralCodeIsValid: false } }
    );

  } else {
    subscription.paymentStatus = "pending";
  }

  await subscription.save();
  return subscription;
};
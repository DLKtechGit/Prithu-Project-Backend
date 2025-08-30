const UserSubscription = require('../../models/subcriptionModels/userSubscreptionModel');
const SubscriptionPlan = require('../../models/subcriptionModels/subscriptionPlanModel');

exports.assignPlanToUser = async (userId, planId) => {

  const plan = await SubscriptionPlan.findById(planId);
  if(!plan || !plan.isActive) throw new Error("Plan not available");

  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + plan.durationDays);

  const subscription = await UserSubscription.create({
    userId,
    planId,
    startDate,
    endDate
  });

  return subscription;
};

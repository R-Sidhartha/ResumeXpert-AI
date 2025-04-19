import { prisma } from "./prisma";
import { cache } from "react";

export type SubscriptionLevel = "free" | "pro" | "elite";

export const getCurrentUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel> => {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { subscriptionPlan: true },
    });
    const plan = user?.subscriptionPlan;
    const validPlans = ["free", "pro", "elite"] as const;

    return validPlans.includes(plan as SubscriptionLevel)
      ? (plan as (typeof validPlans)[number])
      : "free";
  },
);

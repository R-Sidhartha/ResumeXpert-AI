"use server";

import { auth } from "@clerk/nextjs/server";
import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export async function createSubscription(planType: "pro" | "elite") {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) throw new Error("User not found in DB");

  const planId =
    planType === "pro"
      ? process.env.RAZORPAY_PLAN_ID_PRO
      : process.env.RAZORPAY_PLAN_ID_ELITE;

  const subscription = await razorpay.subscriptions.create({
    plan_id: planId!,
    customer_notify: 1, // Razorpay sends email
    total_count: 12, // Max billing cycles, you can control it
    notes: {
      userId: dbUser.id,
    },
  });

  // Save subscription to DB
  await prisma.subscription.create({
    data: {
      userId: dbUser.id,
      razorpaySubscriptionId: subscription.id,
      planType,
      status: "created", // You can change this status when payment is confirmed
    },
  });

  return {
    subscriptionId: subscription.id,
  };
}

export async function getPlanDetails() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        subscriptions: {
          // where: { status: { not: "cancelled" } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!user) return;

    if (!user.subscriptions || user.subscriptions.length === 0) {
      return {
        planType: "free",
        status: "free",
        razorpaySubscriptionId: null,
        nextBillingAt: null,
      };
    }

    const activeSub = user.subscriptions?.[0];
    return {
      planType: user.subscriptionPlan ?? "free",
      status: user.subscriptionStatus ?? activeSub.status ?? "free",
      razorpaySubscriptionId: activeSub.razorpaySubscriptionId ?? null,
      nextBillingAt: activeSub?.currentPeriodEnd ?? null,
    };
  } catch (error) {
    console.error(error);
    return {
      planType: "free",
      status: "free",
      razorpaySubscriptionId: null,
      nextBillingAt: null,
    };
  }
}

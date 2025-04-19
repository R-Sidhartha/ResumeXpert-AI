import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { razorpay } from "@/lib/razorpay";

// Use discriminated union for conditional validation
const verifySchema = z.discriminatedUnion("planType", [
  z.object({
    planType: z.literal("free"),
  }),
  z.object({
    planType: z.enum(["pro", "elite"]),
    subscriptionId: z.string(),
    paymentId: z.string(),
    signature: z.string(),
  }),
]);

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Get internal DB userId
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { id: userId } = user;

  const body = await req.json();
  const parsed = verifySchema.safeParse(body);
  console.log("parsed", parsed);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { planType } = parsed.data;

  if (planType === "free") {
    // No subscription ID or Razorpay needed for free
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        subscriptionPlan: "free",
        subscriptionId: null,
      },
    });

    return NextResponse.json({ success: true });
  }

  // For paid plans: pro, elite
  const { subscriptionId, paymentId, signature } = parsed.data;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${paymentId}|${subscriptionId}`)
    .digest("hex");

  console.log("generatedSignature", generatedSignature);
  console.log("signature", signature);

  if (generatedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const razorpaySubscription =
    await razorpay.subscriptions.fetch(subscriptionId);
  console.log("razorpaySubscription", razorpaySubscription);
  const currentPeriodEnd =
    razorpaySubscription.current_end != null
      ? new Date(razorpaySubscription.current_end * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // 🪝 Fetch referral before transaction
  const referral = await prisma.referral.findFirst({
    where: {
      refereeId: userId,
    },
    include: {
      referrer: true,
    },
  });

  // Update user and subscription records
  await prisma.$transaction([
    // Subscription logic
    prisma.user.update({
      where: { clerkId },
      data: {
        subscriptionPlan: planType,
        subscriptionId,
      },
    }),
    prisma.subscription.upsert({
      where: { razorpaySubscriptionId: subscriptionId },
      create: {
        razorpaySubscriptionId: subscriptionId,
        userId,
        status: "pending",
        planType,
        currentPeriodEnd,
      },
      update: {
        status: "pending",
        planType,
        currentPeriodEnd,
      },
    }),
    prisma.subscription.updateMany({
      where: {
        userId,
        razorpaySubscriptionId: { not: subscriptionId },
        status: { not: "cancelled" },
      },
      data: {
        status: "inactive",
      },
    }),

    // Referral credit logic
    ...(referral && referral.referrerId !== userId && !referral.rewardGiven
      ? [
          prisma.user.update({
            where: { id: userId },
            data: {
              credits: {
                increment: 25,
              },
            },
          }),
          prisma.user.update({
            where: { id: referral.referrerId },
            data: {
              credits: {
                increment: 50,
              },
            },
          }),
          prisma.referral.update({
            where: {
              referrerId_refereeId: {
                referrerId: referral.referrerId,
                refereeId: userId,
              },
            },
            data: {
              rewardGiven: true,
            },
          }),
        ]
      : []),
  ]);

  return NextResponse.json({ success: true });
}

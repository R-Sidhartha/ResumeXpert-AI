import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();
  if (!clerkId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const razorpaySubscriptionId = body.razorpaySubscriptionId;

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  });

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { id: userId } = user;

  const subscription = await prisma.subscription.findUnique({
    where: {
      userId,
      razorpaySubscriptionId,
    },
  });

  if (!subscription || !subscription.razorpaySubscriptionId) {
    return NextResponse.json(
      { error: "No active subscription" },
      { status: 404 },
    );
  }

  let razorpaySub;

  try {
    razorpaySub = await razorpay.subscriptions.fetch(
      subscription.razorpaySubscriptionId,
    );
  } catch (fetchErr: any) {
    console.error("Failed to fetch Razorpay subscription:", fetchErr);
  }

  if (razorpaySub?.status === "cancelled") {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "cancelled",
      },
    });
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "pending" },
    });

    return NextResponse.json({
      success: true,
      status: "cancelled",
      message:
        "Subscription is cancelled, but the user can still access the plan until the period ends.",
    });
  }

  try {
    // Step 1: Fetch current status from Razorpay

    // Cancel Razorpay subscription
    await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);

    // ✅ Optimistically mark user.subscriptionStatus = "cancelled"
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: "cancelled",
      },
    });

    // Optimistically mark cancelled (webhook will finalize if needed)
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: "pending" },
    });

    return NextResponse.json({
      success: true,
      status: "cancelled",
      message:
        "Subscription is cancelled, but user can still use the plan until the period ends.",
    });
  } catch (err: any) {
    console.error("Cancel subscription error:", err?.message || err);
    return NextResponse.json(
      { error: err?.description || "Cancellation failed" },
      { status: 500 },
    );
  }
}

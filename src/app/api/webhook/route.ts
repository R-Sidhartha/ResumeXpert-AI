// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;
console.log("Secret", RAZORPAY_WEBHOOK_SECRET);
export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  console.log("signature", signature);
  console.log("expectedSignature", expectedSignature);

  if (signature !== expectedSignature) {
    return NextResponse.json({ status: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  console.log("event", event);

  try {
    const razorpaySub = event.payload.subscription?.entity;
    const razorpaySubId: string | undefined = razorpaySub?.id;

    if (!razorpaySubId) {
      return NextResponse.json(
        { error: "Missing subscription ID" },
        { status: 400 },
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { razorpaySubscriptionId: razorpaySubId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 },
      );
    }

    const userId = subscription.userId;

    // 🛡️ Prevent changes to old/inactive/cancelled subscriptions
    if (["cancelled", "inactive"].includes(subscription.status)) {
      console.log("Ignoring webhook for inactive or cancelled subscription");
      return NextResponse.json({ status: "Ignored" });
    }

    switch (event.event) {
      case "subscription.authenticated": {
        // Optional: Just log for now, as it confirms payment method verification
        console.log("Subscription authenticated");
        break;
      }

      case "subscription.charged":
      case "subscription.activated":
      case "invoice.paid": {
        const currentPeriodEnd = razorpaySub.current_end
          ? new Date(razorpaySub.current_end * 1000)
          : null;

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: "active", currentPeriodEnd, metadata: razorpaySub },
        });

        // Only update user's plan if this is their latest active subscription
        const latestSub = await prisma.subscription.findFirst({
          where: { userId, status: "active" },
          orderBy: { createdAt: "desc" },
        });

        if (latestSub?.id === subscription.id) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionPlan: subscription.planType,
              subscriptionId: subscription.id,
            },
          });
          // ✅ Handle referral reward (ONLY if not already rewarded)
          const referral = await prisma.referral.findFirst({
            where: { refereeId: userId },
          });

          if (referral && !referral.rewardGiven) {
            await prisma.$transaction([
              prisma.user.update({
                where: { id: referral.referrerId },
                data: {
                  credits: {
                    increment: 50, // adjust based on your reward
                  },
                },
              }),
              prisma.user.update({
                where: { id: userId },
                data: {
                  credits: {
                    increment: 25,
                  },
                },
              }),
              prisma.referral.update({
                where: { id: referral.id },
                data: { rewardGiven: true },
              }),
            ]);
          }
        } else {
          console.log(
            "Skipping user plan update due to newer active subscription",
          );
        }
        break;
      }
      case "invoice.payment_failed": {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: "failed", metadata: razorpaySub },
        });
        break;
      }

      case "subscription.cancelled": {
        const currentPeriodEnd = razorpaySub.current_end
          ? new Date(razorpaySub.current_end * 1000)
          : null;

        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: "cancelled",
            currentPeriodEnd,
            metadata: razorpaySub,
          },
        });
        break;
      }
      // Add other events if needed
      default:
        console.log("Unhandled event:", event.event);
        break;
    }
  } catch (err) {
    console.error("Webhook Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ status: "ok" });
}

// app/api/redeem/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Parse the request body for planType (PRO or ELITE)
  const { planType } = await req.json();
  if (!planType || !["PRO", "ELITE"].includes(planType)) {
    return NextResponse.json({ error: "Invalid plan type" }, { status: 400 });
  }

  let creditsRequired = 0;

  // Determine the credits required based on the selected plan
  if (planType === "ELITE") {
    creditsRequired = 250;
  } else if (planType === "PRO") {
    creditsRequired = 150;
  }

  if ((user?.credits ?? 0) < creditsRequired) {
    return NextResponse.json(
      { error: "Not enough credits to redeem this plan" },
      { status: 400 },
    );
  }

  // Check if the user is already on the requested plan
  if (user.subscriptionPlan === planType) {
    return NextResponse.json(
      { error: `You are already on the ${planType} plan.` },
      { status: 400 },
    );
  }

  // Apply new subscription logic if the user isn't already on the requested plan
  const currentPeriodEnd = new Date();
  currentPeriodEnd.setMonth(currentPeriodEnd.getMonth() + 1); // 1 month access

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: {
        credits: { decrement: creditsRequired },
        subscriptionPlan: planType, // Assign new subscription plan
        subscriptionId: null, // Optional: mark as non-paid subscription if needed
      },
    }),
    prisma.redemption.create({
      data: {
        userId,
        planType,
        creditsUsed: creditsRequired,
      },
    }),
  ]);

  return NextResponse.json({ success: true, newPlan: planType });
}

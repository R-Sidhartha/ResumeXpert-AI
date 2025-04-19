import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      subscriptions: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!user) return;

  const subscription = user.subscriptions[0];

  // ✅ If active, don't downgrade
  if (subscription.status === "active") {
    return NextResponse.json({ downgraded: false });
  }

  const isExpired =
    subscription.status === "cancelled" &&
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd < new Date();

  if (isExpired) {
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionPlan: "free", subscriptionId: null },
    });

    return NextResponse.json({ downgraded: true });
  }

  return NextResponse.json({ downgraded: false });
}

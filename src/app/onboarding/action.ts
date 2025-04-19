"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Adjust based on your actual Prisma schema
interface UserData {
  firstName?: string;
  lastName?: string;
  github?: string;
  linkedIn?: string;
  onboarded?: boolean;
  referralCode?: string; // Added this for referral support
}

export async function setUserData(userData: UserData) {
  const { userId } = await auth();
  if (!userId) return;

  try {
    const currentUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!currentUser) {
      console.error("User not found with clerkId:", userId);
      return;
    }

    // --- Referral logic ---
    if (userData.referralCode) {
      const referredByUser = await prisma.user.findUnique({
        where: { referralCode: userData.referralCode },
      });

      // Prevent self-referral
      if (referredByUser && referredByUser.id !== currentUser.id) {
        // Update current user with referral info
        const updatedUser = await prisma.user.update({
          where: { clerkId: userId },
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            github: userData.github,
            linkedIn: userData.linkedIn,
            onboarded: true,
            referredById: referredByUser.id,
            subscriptionPlan: "free",
            subscriptionId: null,
            subscriptionStatus: null,
          },
        });

        // Create referral entry (avoid duplicates with upsert)
        await prisma.referral.upsert({
          where: {
            referrerId_refereeId: {
              referrerId: referredByUser.id,
              refereeId: updatedUser.id,
            },
          },
          update: {},
          create: {
            referrerId: referredByUser.id,
            refereeId: updatedUser.id,
          },
        });

        return;
      }
    }

    // --- No referral or self-referral case ---
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        github: userData.github,
        linkedIn: userData.linkedIn,
        onboarded: true,
        subscriptionPlan: "free",
        subscriptionId: null,
        subscriptionStatus: null,
      },
    });
  } catch (error) {
    console.error("Failed to update user during onboarding:", error);
    return;
  }
}

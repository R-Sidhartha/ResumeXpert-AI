"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Define a type for incoming user data (adjust as per your Prisma model)
interface UserData {
  name?: string;
  github?: string;
  linkedIn?: string;
  onboarded?: boolean;
}

export async function setUserData(userData: UserData) {
  const { userId } = await auth();
  if (!userId) return;

  try {
    await prisma.user.update({
      where: { clerkId: userId },
      data: {
        ...userData,
        onboarded: true, // Always mark as onboarded when updating via onboarding
      },
    });
  } catch (error) {
    console.error("Failed to update user during onboarding:", error);
    return;
  }
}

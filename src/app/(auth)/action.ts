"use server";

import { PrismaClient } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function storeUserOnLogin() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (existingUser) return existingUser;

  // Get user details from Clerk
  const user = await currentUser();

  return prisma.user.create({
    data: {
      clerkId: userId,
      email: user?.emailAddresses[0]?.emailAddress || "",
      firstName: user?.firstName || "Unknown",
      lastName: user?.lastName || "Unknown",
      onboarded: false,
    },
  });
}

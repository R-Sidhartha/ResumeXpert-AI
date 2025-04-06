"use server";

import { prisma } from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserResumes() {
  try {
    // Get the authenticated user
    const { userId } = await auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const [resumes, count] = await prisma.$transaction([
      prisma.resume.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        include: resumeDataInclude,
      }),
      prisma.resume.count({
        where: { userId },
      }),
    ]);

    if (resumes.length === 0) {
      return { message: "No resumes found.", resumes: [] };
    }

    return { count, resumes };
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return {
      count: 0,
      resumes: [],
    };
  }
}

export const getPdfSrcFromDB = async (
  resumeId: string,
): Promise<string | null> => {
  if (!resumeId) {
    throw new Error("Invalid resumeId");
  }

  try {
    console.log("Fetching PDF URL for resumeId:", resumeId);

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { pdfUrl: true },
    });

    return resume?.pdfUrl || null;
  } catch (error) {
    console.error("Error retrieving resume PDF URL:", error);
    throw new Error("Failed to fetch resume PDF URL.");
  }
};

export async function deleteResume(id: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const resume = await prisma.resume.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!resume) {
    throw new Error("Resume not found");
  }

  await prisma.resume.delete({
    where: {
      id,
    },
  });

  revalidatePath("/resumes");
}

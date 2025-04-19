"use server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserSubscriptionLevel } from "@/lib/userSubscriptionPlan";

//end point to retrieve resume templates
export const fetchResumeTemplate = async (templateId: string) => {
  if (!templateId) {
    throw new Error("Invalid templateId");
  }
  try {
    const templateData = await prisma.resumeTemplate.findUnique({
      where: { id: templateId },
      select: {
        id: true,
        name: true,
        template: true,
      },
    });

    if (!templateData) {
      console.log("No template found");
      return null;
    }
    return templateData;
  } catch (error) {
    console.error("Error fetching resume template:", error);
  }
};

export const getUserData = async (clerkId: string) => {
  try {
    // Validate clerkId
    if (!clerkId || typeof clerkId !== "string") {
      console.warn("Invalid or missing Clerk ID.");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      select: {
        firstName: true,
        lastName: true,
        github: true,
        linkedIn: true,
      },
    });

    if (!user) {
      console.warn(`No user found with clerkId: ${clerkId}`);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const getPdfUrl = async (resumeId: string) => {
  if (!resumeId) {
    throw new Error("Invalid resumeId");
  }

  try {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { pdfUrl: true },
    });

    if (!resume) {
      throw new Error("Resume not found");
    }

    return resume.pdfUrl;
  } catch (error) {
    console.error("Error getting resume PDF URL:", error);
    throw new Error("Failed to get resume PDF URL.");
  }
};

export const getCustomizations = async (resumeId: string) => {
  if (!resumeId) {
    throw new Error("Invalid resumeId");
  }

  try {
    const customizations = await prisma.customization.findUnique({
      where: { resumeId },
    });

    return customizations;
  } catch (error) {
    console.error("Error fetching resume customizations:", error);
    return null;
  }
};

//endpoint to save ot update resume
// import { canCreateResume, canUseCustomizations } from "@/lib/permissions";
// import { getUserSubscriptionLevel } from "@/lib/subscription";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
// import { del, put } from "@vercel/blob";
// import path from "path";

export async function saveResume(values: ResumeValues) {
  const { id, resumeTemplateId, customization } = values;
  const cleanedCustomization = { ...customization };
  if ("resumeId" in cleanedCustomization) {
    delete (cleanedCustomization as any).resumeId;
  }

  const {
    // photo,
    workExperiences,
    educations,
    Projects,
    POR,
    skills,
    achievements,
    extraCurriculars,
    certifications,
    customSections,
    ...resumeValues
  } = resumeSchema.parse(values);

  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const subscriptionLevel = await getCurrentUserSubscriptionLevel(userId);

  const resumeCount = await prisma.resume.count({ where: { userId } });

  // Check creation limits
  const planLimits: Record<string, number | null> = {
    free: 3,
    pro: 10,
    elite: null, // unlimited
  };

  const currentLimit = planLimits[subscriptionLevel];

  if (!id && currentLimit !== null && resumeCount >= currentLimit) {
    throw new Error(
      subscriptionLevel === "free"
        ? "Free plan allows only 3 resumes. Upgrade to Pro or Elite to create more."
        : "Pro plan allows only 10 resumes. Upgrade to Elite for unlimited resume creation.",
    );
  }

  const template = await prisma.resumeTemplate.findUnique({
    where: { id: resumeTemplateId },
  });

  if (!template) {
    throw new Error("Template not found.");
  }

  // Check if the template's subscription level is compatible with the user's subscription
  const templatePlan = template.subscriptionLevel;

  const planRank: Record<string, number> = {
    free: 0,
    pro: 1,
    elite: 2,
  };

  if (planRank[subscriptionLevel] < planRank[templatePlan]) {
    throw new Error(
      `This template is available only for ${templatePlan} plan and higher. Please upgrade your plan to use it.`,
    );
  }

  // Ensure user exists
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found in database. Please try logging in again.");
  }

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }
  if (id) {
    return prisma.resume.update({
      where: { id },
      data: {
        ...resumeValues,
        resumeTemplateId,
        // photoUrl: newPhotoUrl,
        customization: {
          upsert: {
            update: {
              ...cleanedCustomization,
            },
            create: {
              ...cleanedCustomization,
            },
          },
        },
        achievements: achievements ?? [],
        certifications: certifications ?? [],
        extraCurriculars: extraCurriculars ?? [],
        workExperiences: {
          deleteMany: {},
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : null,
            endDate: exp.endDate ? new Date(exp.endDate) : null,
          })),
        },
        educations: {
          deleteMany: {},
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            endDate: edu.endDate ? new Date(edu.endDate) : null,
          })),
        },
        projects: {
          deleteMany: {},
          create: Projects?.map((pro) => ({
            ...pro,
            startDate: pro.startDate ? new Date(pro.startDate) : null,
            endDate: pro.endDate ? new Date(pro.endDate) : null,
          })),
        },
        positionsOfResponsibility: {
          deleteMany: {},
          create: POR?.map((por) => ({
            ...por,
            startDate: por.startDate ? new Date(por.startDate) : null,
            endDate: por.endDate ? new Date(por.endDate) : null,
          })),
        },
        skills: {
          deleteMany: {},
          create: skills?.map((skill) => ({
            ...skill,
          })),
        },
        customSections: {
          deleteMany: {},
          create:
            customSections?.map((section) => ({
              title: section.title,
              entries: {
                create:
                  section.entries?.map((entry) => ({
                    heading: entry.heading,
                    subheading: entry.subheading,
                    location: entry.location,
                    startDate: entry.startDate
                      ? new Date(entry.startDate)
                      : null,
                    endDate: entry.endDate ? new Date(entry.endDate) : null,
                    description: entry.description ?? [],
                  })) ?? [],
              },
            })) ?? [],
        },
        updatedAt: new Date(),
      },
    });
  } else {
    return prisma.resume.create({
      data: {
        ...resumeValues,
        userId,
        resumeTemplateId,
        // photoUrl: newPhotoUrl,
        customization: {
          create: {
            ...customization,
          },
        },
        achievements: achievements ?? [],
        certifications: certifications ?? [],
        extraCurriculars: extraCurriculars ?? [],
        workExperiences: {
          create: workExperiences?.map((exp) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : null,
            endDate: exp.endDate ? new Date(exp.endDate) : null,
          })),
        },
        educations: {
          create: educations?.map((edu) => ({
            ...edu,
            startDate: edu.startDate ? new Date(edu.startDate) : null,
            endDate: edu.endDate ? new Date(edu.endDate) : null,
          })),
        },
        projects: {
          create: Projects?.map((pro) => ({
            ...pro,
            startDate: pro.startDate ? new Date(pro.startDate) : null,
            endDate: pro.endDate ? new Date(pro.endDate) : null,
          })),
        },
        positionsOfResponsibility: {
          create: POR?.map((por) => ({
            ...por,
            startDate: por.startDate ? new Date(por.startDate) : null,
            endDate: por.endDate ? new Date(por.endDate) : null,
          })),
        },
        skills: {
          create: skills?.map((skill) => ({
            ...skill,
          })),
        },
        customSections: {
          create:
            customSections?.map((section) => ({
              title: section.title,
              entries: {
                create:
                  section.entries?.map((entry) => ({
                    heading: entry.heading,
                    subheading: entry.subheading,
                    location: entry.location,
                    startDate: entry.startDate
                      ? new Date(entry.startDate)
                      : null,
                    endDate: entry.endDate ? new Date(entry.endDate) : null,
                    description: entry.description ?? [],
                  })) ?? [],
              },
            })) ?? [],
        },
      },
    });
  }
}

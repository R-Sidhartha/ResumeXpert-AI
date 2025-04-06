"use server";
import { prisma } from "@/lib/prisma";

//end point to retrieve resume templates
export const fetchResumeTemplate = async (templateId: string) => {
  if (!templateId) {
    throw new Error("Invalid templateId");
  }
  try {
    const templateData = await prisma.resumeTemplate.findUnique({
      where: { id: templateId },
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

export const savePdfSrcToDB = async (resumeId: string, pdfUrl: string) => {
  if (!resumeId || !pdfUrl) {
    throw new Error("Invalid resumeId or pdfUrl");
  }

  try {
    console.log("running the savePdfSrcToDB function");
    await prisma.resume.update({
      where: { id: resumeId },
      data: { pdfUrl },
    });
  } catch (error) {
    console.error("Error updating resume PDF URL:", error);
    throw new Error("Failed to update resume PDF URL.");
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
  console.log("received values", values);

  const {
    // photo,
    workExperiences,
    educations,
    Projects,
    POR,
    skills,
    achievements,
    ExtraCurriculars,
    Certifications,
    // customization,
    ...resumeValues
  } = resumeSchema.parse(values);

  const { userId } = await auth();

  console.log("resumeValues this for testing purposes", resumeValues);

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Ensure user exists
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    throw new Error("User not found in database. Please try logging in again.");
  }

  // const subscriptionLevel = await getUserSubscriptionLevel(userId);

  // if (!id) {
  //   const resumeCount = await prisma.resume.count({ where: { userId } });

  //   if (!canCreateResume(subscriptionLevel, resumeCount)) {
  //     throw new Error(
  //       "Maximum resume count reached for this subscription level",
  //     );
  //   }
  // }

  const existingResume = id
    ? await prisma.resume.findUnique({ where: { id, userId } })
    : null;

  if (id && !existingResume) {
    throw new Error("Resume not found");
  }

  // const hasCustomizations =
  //   (resumeValues.borderStyle &&
  //     resumeValues.borderStyle !== existingResume?.borderStyle) ||
  //   (resumeValues.colorHex &&
  //     resumeValues.colorHex !== existingResume?.colorHex);

  // if (hasCustomizations && !canUseCustomizations(subscriptionLevel)) {
  //   throw new Error("Customizations not allowed for this subscription level");
  // }

  // let newPhotoUrl: string | undefined | null = undefined;

  // if (photo instanceof File) {
  //   if (existingResume?.photoUrl) {
  //     await del(existingResume.photoUrl);
  //   }

  //   const blob = await put(`resume_photos/${path.extname(photo.name)}`, photo, {
  //     access: "public",
  //   });

  //   newPhotoUrl = blob.url;
  // } else if (photo === null) {
  //   if (existingResume?.photoUrl) {
  //     await del(existingResume.photoUrl);
  //   }
  //   newPhotoUrl = null;
  // }

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
        certifications: Certifications ?? [],
        extraCurriculars: ExtraCurriculars ?? [],
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
        certifications: Certifications ?? [],
        extraCurriculars: ExtraCurriculars ?? [],
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
      },
    });
  }
}

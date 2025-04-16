"use server";

import { prisma } from "../prisma";

export const setUrlsToDB = async (
  resumeId: string,
  pdfUrl: string,
  imgUrl: string,
  uploadedPublicId: string,
) => {
  try {
    await prisma.resume.update({
      where: { id: resumeId },
      data: { pdfUrl, imgUrl, pdfPublicId: uploadedPublicId },
    });
    return;
  } catch (err) {
    console.error("Prisma update error:", err);
    return new Response("Database update failed");
  }
};

export async function getResumeById(resumeId: string) {
  return await prisma.resume.findUnique({
    where: { id: resumeId },
    select: {
      pdfPublicId: true,
    },
  });
}

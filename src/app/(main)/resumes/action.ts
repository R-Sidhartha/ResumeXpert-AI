"use server";
import { prisma } from "@/lib/prisma";

export async function getResumeTemplates() {
  const templates = await prisma.resumeTemplate.findMany();

  return templates;
}

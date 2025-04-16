import { Prisma } from "@prisma/client";
import { ResumeValues } from "./validation";

export interface EditorFormProps {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  // setPdfBytes: (bytes: Uint8Array | null) => void;
}

export const resumeDataInclude = {
  workExperiences: true,
  educations: true,
  projects: true,
  positionsOfResponsibility: true,
  skills: true,
  resumeTemplate: true,
  customization: true,
  customSections: {
    include: {
      entries: true,
    },
  },
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;

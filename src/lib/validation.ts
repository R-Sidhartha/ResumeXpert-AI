import { z } from "zod";

export const optionalString = z.string().trim().optional().or(z.literal(""));

export const generalInfoSchema = z.object({
  title: optionalString,
  description: optionalString,
});

export type GeneralInfoValues = z.infer<typeof generalInfoSchema>;

export const personalInfoSchema = z.object({
  photo: z
    .custom<File | undefined>()
    .refine(
      (file) =>
        !file || (file instanceof File && file.type.startsWith("image/")),
      "Must be an image file",
    )
    .refine(
      (file) => !file || file.size <= 1024 * 1024 * 4,
      "File must be less than 4MB",
    ),
  firstName: optionalString,
  lastName: optionalString,
  jobTitle: optionalString,
  city: optionalString,
  country: optionalString,
  phone: optionalString,
  email: optionalString,
  portfolio: optionalString,
  linkedIn: optionalString,
  github: optionalString,
  twitter: optionalString,
});

export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

export const workExperienceSchema = z.object({
  workExperiences: z
    .array(
      z.object({
        position: optionalString,
        company: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        description: z.array(z.string()).default([]),
      }),
    )
    .optional(),
});

export type WorkExperienceValues = z.infer<typeof workExperienceSchema>;

export type WorkExperience = NonNullable<
  z.infer<typeof workExperienceSchema>["workExperiences"]
>[number];

export const projectsSchema = z.object({
  Projects: z
    .array(
      z.object({
        title: optionalString,
        description: z.array(z.string()).default([]),
        link: optionalString,
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type ProjectValues = z.infer<typeof projectsSchema>;
export type Projects = NonNullable<
  z.infer<typeof projectsSchema>["Projects"]
>[number];

export const certificationSchema = z.object({
  certifications: z.array(z.string().trim()).optional(),
});

export type CertificationValues = z.infer<typeof certificationSchema>;

export const extraCurricularSchema = z.object({
  extraCurriculars: z.array(z.string().trim()).optional(),
});

export type ExtraCurricularValues = z.infer<typeof extraCurricularSchema>;

export const achievementsSchema = z.object({
  achievements: z.array(z.string().trim()).optional(),
});

export type AchievementsValues = z.infer<typeof achievementsSchema>;

export const porSchema = z.object({
  POR: z
    .array(
      z.object({
        position: optionalString,
        organization: optionalString,
        description: z.array(z.string()).default([]),
        startDate: optionalString,
        endDate: optionalString,
      }),
    )
    .optional(),
});

export type PORValues = z.infer<typeof porSchema>;
export type POR = NonNullable<z.infer<typeof porSchema>["POR"]>[number];

export const educationSchema = z.object({
  educations: z
    .array(
      z.object({
        degree: optionalString,
        school: optionalString,
        link: optionalString,
        startDate: optionalString,
        endDate: optionalString,
        isHighestQualification: z.boolean().optional(),
      }),
    )
    .optional(),
});

export type EducationValues = z.infer<typeof educationSchema>;

export const skillsSchema = z.object({
  skills: z
    .array(
      z.object({
        label: z.string().trim().min(1, "Label is required"),
        skills: z.array(z.string().trim().min(1, "Skill cannot be empty")),
      }),
    )
    .optional(),
});

export type SkillsValues = z.infer<typeof skillsSchema>;

export const summarySchema = z.object({
  summary: optionalString,
});

export type SummaryValues = z.infer<typeof summarySchema>;

export const customizationSchema = z.object({
  fontSize: optionalString,
  bulletIcon: optionalString,
  margin: optionalString,
  color: optionalString,
  lineSpacing: optionalString,
  sectionSpacing: optionalString,
  itemSpacing: optionalString,
});

export type CustomizationValues = z.infer<typeof customizationSchema>;

export const resumeSchema = z.object({
  ...generalInfoSchema.shape,
  ...personalInfoSchema.shape,
  ...workExperienceSchema.shape,
  ...projectsSchema.shape,
  ...porSchema.shape,
  ...achievementsSchema.shape,
  ...certificationSchema.shape,
  ...extraCurricularSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...summarySchema.shape,
  colorHex: optionalString,
  borderStyle: optionalString,
  resumeTemplateId: z.string(),
  pdfUrl: optionalString,
  imgUrl: optionalString,
});

export const resumeTemplateSchema = z.object({
  id: z.string(),
  name: optionalString,
  description: optionalString, // Changed 'described' to 'description'
  thumbnailUrl: optionalString,
  subscriptionLevel: optionalString,
  template: optionalString,
  resumes: z.array(z.lazy(() => resumeSchema)).optional(), // Ensuring it references `resumeSchema`
});

export type resumeTemplateValues = z.infer<typeof resumeTemplateSchema>;
//we omit the photo validation form resumeValues and set it to different type (from file | undefined to file | string | null) beause we need to handle the photo in a different way in the editor and in the database(as we store photo as a string(blobUrl) in the database)
export type ResumeValues = Omit<z.infer<typeof resumeSchema>, "photo"> & {
  id?: string;
  photo?: File | string | null;
  // resumeTemplateId: string;
  resumeTemplate?: resumeTemplateValues;
  customization?: CustomizationValues | null;
};

export const generateWorkExperienceSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateWorkExperienceInput = z.infer<
  typeof generateWorkExperienceSchema
>;

export const generateProjectsSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GenerateProjectsInput = z.infer<typeof generateProjectsSchema>;

export const generatePORSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Required")
    .min(20, "Must be at least 20 characters"),
});

export type GeneratePORInput = z.infer<typeof generatePORSchema>;

export const generateSummarySchema = z.object({
  jobTitle: optionalString,
  ...workExperienceSchema.shape,
  ...educationSchema.shape,
  ...skillsSchema.shape,
  ...projectsSchema.shape,
  ...certificationSchema.shape,
  ...extraCurricularSchema.shape,
  ...achievementsSchema.shape,
  ...porSchema.shape,
});

export type GenerateSummaryInput = z.infer<typeof generateSummarySchema>;

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "./types";
import { CustomizationValues, ResumeValues } from "./validation";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string) {
  if (!dateString) return "Present"; // Handle empty or ongoing experiences
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

export function formatYear(dateString?: string) {
  if (!dateString) return "Present"; // Handle ongoing education
  const date = new Date(dateString);
  return date.getFullYear().toString(); // Extract only the year
}

// export const DEFAULT_CUSTOMIZATIONS: CustomizationValues = {
//   bulletIcon: "\\faAngleRight",
//   color: "0.25, 0.5, 0.75",
//   margin: "0.75in",
//   lineSpacing: "1.0",
//   sectionSpacing: "0pt",
//   itemSpacing: "2pt",
//   fontSize: "10pt",
// };

export function hexToRgbFloat(hex: string): string {
  // Remove '#' if present
  hex = hex.replace("#", "");

  // If shorthand hex (e.g., #03F), expand it
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  return `${r.toFixed(2)}, ${g.toFixed(2)}, ${b.toFixed(2)}`;
}

export function rgbFloatToHex(rgb: string): string {
  const [r, g, b] = rgb.split(",").map((v) => parseFloat(v.trim()));
  const toHex = (v: number) => {
    const hex = Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
    return hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 🔐 Escape LaTeX special characters
export function highlightAndEscapeLatex(input: string | undefined): string {
  if (!input) return "";

  const HIGHLIGHT_REGEX = /\{([^{}]+)\}/g;
  const highlightPlaceholders: string[] = [];

  // Step 1: Replace {word} with placeholder
  const withPlaceholders = input.replace(HIGHLIGHT_REGEX, (_, word) => {
    const placeholder = `<<HIGHLIGHT_${highlightPlaceholders.length}>>`;
    highlightPlaceholders.push(word);
    return placeholder;
  });

  // Step 2: Split by placeholders
  const parts = withPlaceholders.split(/(<<HIGHLIGHT_\d+>>)/g);

  // Step 3: Process each part
  const processed = parts
    .map((part) => {
      const match = part.match(/^<<HIGHLIGHT_(\d+)>>$/);
      if (match) {
        // Restore placeholder with escaped bold text
        const index = parseInt(match[1], 10);
        const raw = highlightPlaceholders[index];
        const escaped = escapeLatex(raw);
        return `\\textbf{${escaped}}`;
      } else {
        // Escape normal text
        return escapeLatex(part);
      }
    })
    .join("");

  return processed;
}

// Helper to escape LaTeX
function escapeLatex(str: string): string {
  return str
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/%/g, "\\%")
    .replace(/&/g, "\\&")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\~{}");
}

export const getScoreLabel = (score: string | undefined) => {
  if (!score) return "";
  const trimmed = score.trim();
  if (trimmed.includes("%")) return "Percentage";
  if (trimmed.includes("/")) return "GPA";
  if (!isNaN(Number(trimmed))) return "GPA"; // fallback
  return ""; // unknown format
};

export function mapToResumeValues(data: ResumeServerData): ResumeValues {
  return {
    id: data.id,
    title: data.title || undefined,
    description: data.description || undefined,
    photo: data.photoUrl || undefined,
    firstName: data.firstName || undefined,
    lastName: data.lastName || undefined,
    jobTitle: data.jobTitle || undefined,
    city: data.city || undefined,
    country: data.country || undefined,
    phone: data.phone || undefined,
    email: data.email || undefined,
    resumeTemplateId: data.resumeTemplateId || "",
    achievements: data.achievements || [],
    certifications: data.certifications || [],
    extraCurriculars: data.extraCurriculars || [],
    portfolio: data.portfolio || undefined,
    github: data.github || undefined,
    linkedIn: data.linkedIn || undefined,
    customization: data.customization
      ? {
          bulletIcon: data.customization.bulletIcon ?? undefined,
          margin: data.customization.margin ?? undefined,
          fontSize: data.customization.fontSize ?? undefined,
          lineSpacing: data.customization.lineSpacing ?? undefined,
          sectionSpacing: data.customization.sectionSpacing ?? undefined,
          itemSpacing: data.customization.itemSpacing ?? undefined,
          color: data.customization.color ?? undefined,
          wordSpacing: data.customization.wordSpacing ?? undefined,
          sectionOrder: data.customization.sectionOrder ?? undefined,
          sectionTitles:
            typeof data.customization.sectionTitles === "object" &&
            data.customization.sectionTitles !== null
              ? (data.customization.sectionTitles as Record<string, string>)
              : undefined,
        }
      : undefined,
    workExperiences: data.workExperiences.map((exp) => ({
      position: exp.position || undefined,
      company: exp.company || undefined,
      startDate: exp.startDate?.toISOString().split("T")[0],
      endDate: exp.endDate?.toISOString().split("T")[0],
      description: exp.description || undefined,
    })),
    educations: data.educations.map((edu) => ({
      degree: edu.degree || undefined,
      school: edu.school || undefined,
      startDate: edu.startDate?.toISOString().split("T")[0],
      endDate: edu.endDate?.toISOString().split("T")[0],
    })),
    POR: data.positionsOfResponsibility.map((por) => ({
      position: por.position || undefined,
      organization: por.organization || undefined,
      description: por.description || undefined,
      startDate: por.startDate?.toISOString().split("T")[0],
      endDate: por.endDate?.toISOString().split("T")[0],
    })),
    Projects: data.projects.map((pro) => ({
      title: pro.title || undefined,
      description: pro.description || undefined,
      link: pro.link || undefined,
      startDate: pro.startDate?.toISOString().split("T")[0],
      endDate: pro.endDate?.toISOString().split("T")[0],
    })),
    skills: data.skills.map((skill) => ({
      label: skill.label || "untitled",
      skills: skill.skills || [],
    })),
    borderStyle: data.borderStyle,
    colorHex: data.colorHex,
    summary: data.summary || undefined,
    customSections: data?.customSections
      ? data?.customSections?.map((section) => ({
          title: section.title || undefined,
          entries: Array.isArray(section.entries)
            ? section.entries.map((entry) => ({
                heading: entry.heading || undefined,
                subheading: entry.subheading || undefined,
                location: entry.location || undefined,
                startDate:
                  entry.startDate?.toISOString().split("T")[0] || undefined,
                endDate:
                  entry.endDate?.toISOString().split("T")[0] || undefined,
                description: entry.description || undefined,
              }))
            : [],
        }))
      : [], // If no customSections, default to an empty array
  };
}

export const mergeAIContentIntoResumeData = (
  resumeData: ResumeValues,
  aiText: Partial<ResumeValues>,
): ResumeValues => {
  return {
    ...resumeData,

    // Overwrite scalar fields
    phone: aiText.phone ?? resumeData.phone,
    email: aiText.email ?? resumeData.email,
    summary: aiText.summary ?? resumeData.summary,

    // Overwrite arrays entirely if provided
    workExperiences: aiText.workExperiences ?? resumeData.workExperiences ?? [],
    Projects: aiText.Projects ?? resumeData.Projects ?? [],
    POR: aiText.POR ?? resumeData.POR ?? [],
    certifications: aiText.certifications ?? resumeData.certifications ?? [],
    extraCurriculars:
      aiText.extraCurriculars ?? resumeData.extraCurriculars ?? [],
    achievements: aiText.achievements ?? resumeData.achievements ?? [],
    educations: aiText.educations ?? resumeData.educations ?? [],
    skills: aiText.skills ?? resumeData.skills ?? [],
  };
};

export function injectOrderedSections({
  template,
  sectionOrder,
  sectionMap,
}: {
  template: string;
  sectionOrder: string[];
  sectionMap: Record<string, string>;
}): string {
  const orderedSections = sectionOrder
    .map((sectionKey) => sectionMap[sectionKey.toUpperCase()] || "")
    .join("\n\n");

  return template.replace("<<DYNAMIC_SECTIONS>>", orderedSections);
}

export function getSectionTitle(
  key: string,
  customization?: CustomizationValues | null,
): string {
  const normalizedKey = key.trim().toLowerCase();

  const defaultTitles: Record<string, string> = {
    education: "Education",
    experience: "Experience",
    projects: "Projects",
    certifications: "Certifications",
    por: "Positions of Responsibility",
    skills: "Technical Skills",
    achievements: "Achievements",
    extracurriculars: "Extra Curricular",
    customsections: "Custom Sections",
    summary: "Summary",
  };

  const customTitle =
    customization?.sectionTitles &&
    Object.entries(customization.sectionTitles).find(
      ([k]) => k.trim().toLowerCase() === normalizedKey,
    )?.[1];

  return highlightAndEscapeLatex(
    customTitle ?? defaultTitles[normalizedKey] ?? "",
  );
}

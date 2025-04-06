import { formatDate, formatYear } from "../utils";
import { ResumeValues } from "../validation";

// 🔐 Escape LaTeX special characters
function escapeLatex(str: string | undefined): string {
  if (!str) return "";
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

export function generateSleek(
  template: string,
  resumeData: ResumeValues,
): string {
  const placeholders: { [key: string]: string } = {
    "<<FONT_SIZE>>": resumeData.customization?.fontSize || "10pt",
    "<<PAGE_MARGIN>>": resumeData.customization?.margin || "0.75in",
    "<<LINE_SPACING>>": resumeData.customization?.lineSpacing || "1.0",
    "<<SECTION_SPACING>>": resumeData.customization?.sectionSpacing || "0pt",
    "<<ITEM_SPACING>>": resumeData.customization?.itemSpacing || "2pt",
    "<<BULLET_ICON>>": resumeData.customization?.bulletIcon || "\\faAngleRight",
    "<<RGB>>": resumeData.customization?.color || "0.25, 0.5, 0.75",
    "<<NAME>>": `${escapeLatex(resumeData.firstName || "John")} ${escapeLatex(resumeData.lastName || "Doe")}`,
    "<<EMAIL>>": escapeLatex(resumeData.email || "example@gmail.com"),
    "<<PHONE>>": escapeLatex(resumeData.phone || "+1234567890"),
    "<<PORTFOLIO>>": escapeLatex(resumeData.portfolio || "https://example.com"),
    "<<LINKEDIN>>": escapeLatex(
      resumeData.linkedIn || "https://linkedin.com/in/johndoe",
    ),
    "<<GITHUB>>": escapeLatex(
      resumeData.github || "https://github.com/johndoe",
    ),
    "<<EDUCATION>>":
      resumeData.educations
        ?.map(
          (edu) =>
            `\\textbf{${escapeLatex(edu.degree)}} \\hfill ${formatYear(edu.startDate)} - ${formatYear(edu.endDate)} \\\\ ${escapeLatex(edu.school)}`,
        )
        .join(" ") || "No Education",
    "<<SKILLS>>": resumeData.skills?.length
      ? `\\begin{itemize} ` +
        resumeData.skills
          .map(
            (skillGroup) =>
              `\\item \\textbf{${escapeLatex(skillGroup.label)}:} ${skillGroup.skills.map(escapeLatex).join(", ")}`,
          )
          .join(" ") +
        ` \\end{itemize}`
      : `\\begin{itemize} \\item \\textbf{Programming Languages:} JavaScript, TypeScript \\item \\textbf{Frameworks:} React, Node.js \\end{itemize}`,
    "<<EXPERIENCE>>":
      resumeData.workExperiences
        ?.map(
          (exp) =>
            `\\subsection{${escapeLatex(exp.position)} $|$ ${escapeLatex(exp.company)} \\hfill ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}} ` +
            `\\begin{itemize} ` +
            (exp.description
              ?.map((desc) => `\\item ${escapeLatex(desc)}`)
              .join(" ") ||
              `\\item Worked on key projects and delivered high-quality results.`) +
            ` \\end{itemize}`,
        )
        .join(" ") || "No Experience",
    "<<PROJECTS>>":
      resumeData.Projects?.map(
        (proj) =>
          `\\subsection{${escapeLatex(proj.title)}${proj.link ? ` $|$ \\href{${escapeLatex(proj.link)}}{Project Link}` : ""}} ` +
          `\\begin{itemize} ` +
          (proj.description
            ?.map((desc) => `\\item ${escapeLatex(desc)}`)
            .join(" ") || `\\item Developed using modern web technologies.`) +
          ` \\end{itemize}`,
      ).join(" ") || "No Projects",
    "<<ExtraCurricular>>": resumeData.extraCurriculars?.length
      ? `\\begin{itemize} ${resumeData.extraCurriculars.map((activity) => `\\item ${escapeLatex(activity)}`).join(" ")} \\end{itemize}`
      : `\\begin{itemize} \\item No Extracurricular Activities \\end{itemize}`,
  };

  Object.keys(placeholders).forEach((key) => {
    template = template?.replace(new RegExp(key, "g"), placeholders[key]);
  });

  return template;
}

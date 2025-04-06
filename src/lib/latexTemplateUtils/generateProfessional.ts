import { formatDate, formatYear } from "../utils";
import { EducationValues } from "../validation";

export function generateProfessional(
  template: string,
  resumeData: any,
): string {
  const highestQualification = resumeData.educations?.find(
    (edu: EducationValues) => edu.isHighestQualification,
  );
  const placeholders: { [key: string]: string } = {
    "<<NAME>>":
      [resumeData.firstName, resumeData.lastName].filter(Boolean).join(" ") ||
      "John Doe",
    "<<EMAIL>>": resumeData.email || "example@gmail.com",
    "<<PHONE>>": resumeData.phone || "+1234567890",
    "<<PORTFOLIO>>": resumeData.portfolio || "https://example.com",
    "<<LINKEDIN>>": resumeData.linkedin || "https://linkedin.com/in/johndoe",
    "<<GITHUB>>": resumeData.github || "https://github.com/johndoe",
    "<<DEGREE>>": highestQualification?.degree || "B.Tech",
    "<<SCHOOL>>": highestQualification?.school || "XYZ University",
    "<<EDUCATION>>":
      resumeData.educations
        ?.map(
          (edu) =>
            `\\hline
\\centering ${formatYear(edu.startDate)} -- ${formatYear(edu.endDate)} & \\centering ${edu.degree} & \\centering ${edu.school} \\tabularnewline`,
        )
        .join(" ") ||
      "\\hline \\centering 2020--2024 & \\centering B.Tech  & \\centering IIT Kanpur  \\tabularnewline",
    "<<SKILLS>>": resumeData.skills?.length
      ? resumeData.skills
          .map(
            (skillGroup) =>
              `\\item \\textbf{${skillGroup.label}:} ${skillGroup.skills.join(", ")}`,
          )
          .join(" ")
      : `\\item \\textbf{Programming Languages:} JavaScript, TypeScript \\item \\textbf{Frameworks:} React, Node.js`,
    "<<EXPERIENCE>>":
      resumeData.workExperiences
        ?.map(
          (exp) =>
            `\\begin{mybox}
             \\textbf{${exp.position}} $|$ ${exp.company} \\hfill\\hfill(\\textit{${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}})
              \\end{mybox}` + // Adds subsection with right-aligned dates
            `\\vspace{-5pt} \\begin{itemize} ` +
            (exp.description?.map((desc) => `\\item ${desc}`).join(" ") ||
              `\\item Worked on key projects and delivered high-quality results.`) +
            ` \\end{itemize} \\vspace{2pt}`,
        )
        .join(" ") || "No Experience",
    "<<PROJECTS>>":
      resumeData.Projects?.map(
        (proj) =>
          `\\begin{mybox}
             \\textbf{${proj.title}} | \\href{${proj.link}}{\\faGlobe}
              \\end{mybox}` +
          `\\vspace{-5pt} \\begin{itemize} ` +
          (proj.description?.map((desc) => `\\item ${desc}`).join(" ") ||
            `\\item Developed using modern web technologies.`) +
          ` \\end{itemize} \\vspace{2pt}`,
      ).join(" ") || "No Projects",
    "<<POR>>":
      resumeData.POR?.map(
        (por) =>
          `\\begin{mybox}
             \\textbf{${por.position} at ${por.organization}}\\hfill\\hfill(\\textit{${formatDate(por.startDate)} - ${formatDate(por.endDate)}})
              \\end{mybox}` +
          `\\vspace{-5pt} \\begin{itemize} ` +
          (por.description?.map((desc) => `\\item ${desc}`).join(" ") ||
            `\\item Developed using modern web technologies.`) +
          ` \\end{itemize}`,
      ).join(" ") || "No PORs",
    // "<<ExtraCurricular>>": resumeData.ExtraCurriculars?.length
    //   ? `\\begin{itemize} ${resumeData.ExtraCurriculars.map((activity) => `\\item ${activity}`).join(" ")} \\end{itemize}`
    //   : `\\begin{itemize} \\item No Extracurricular Activities \\end{itemize}`,
  };

  Object.keys(placeholders).forEach((key) => {
    template = template.replace(new RegExp(key, "g"), placeholders[key]);
  });

  return template;
}

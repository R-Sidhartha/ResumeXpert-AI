import {
  highlightAndEscapeLatex,
  formatDate,
  formatYear,
  injectOrderedSections,
  getSectionTitle,
} from "../utils";
import { ResumeValues } from "../validation";

export function generateProfessional(
  template: string,
  resumeData: ResumeValues,
): string {
  const highestQualification = resumeData.educations?.find(
    (edu) => edu.isHighestQualification,
  );
  const hasScoreColumn = resumeData.educations?.some((edu) => edu.score);
  const placeholders: { [key: string]: string } = {
    "<<FONT_SIZE>>": resumeData.customization?.fontSize || "10pt",
    "<<PAGE_MARGIN>>": resumeData.customization?.margin || "0.1in",
    "<<LINE_SPACING>>": resumeData.customization?.lineSpacing || "1.0",
    "<<SECTION_SPACING>>": resumeData.customization?.sectionSpacing || "0pt",
    "<<ITEM_SPACING>>": resumeData.customization?.itemSpacing || "0pt",
    "<<BULLET_ICON>>": resumeData.customization?.bulletIcon || "\\textbullet",
    "<<RGB>>": resumeData.customization?.color || "0.5, 0.5, 0.5",
    "<<WORD_SPACING>>": resumeData.customization?.wordSpacing || "3pt",
    "<<NAME>>":
      [
        highlightAndEscapeLatex(resumeData.firstName),
        highlightAndEscapeLatex(resumeData.lastName),
      ]
        .filter(Boolean)
        .join(" ") || "John Doe",
    "<<EMAIL>>":
      highlightAndEscapeLatex(resumeData.email) || "example@gmail.com",
    "<<PHONE>>": highlightAndEscapeLatex(resumeData.phone) || "+1234567890",
    "<<PORTFOLIO>>": resumeData.portfolio
      ? `\\href{${highlightAndEscapeLatex(resumeData.portfolio)}}{\\faGlobe \\hspace{2pt} Portfolio}`
      : "",
    "<<LINKEDIN>>":
      highlightAndEscapeLatex(resumeData.linkedIn) ||
      "https://linkedin.com/in/johndoe",
    "<<GITHUB>>":
      highlightAndEscapeLatex(resumeData.github) ||
      "https://github.com/johndoe",
    "<<DEGREE>>":
      highlightAndEscapeLatex(highestQualification?.degree) || "B.Tech",
    "<<SCHOOL>>":
      highlightAndEscapeLatex(highestQualification?.school) || "XYZ University",

    "<<SUMMARY>>": resumeData.summary
      ? ` {\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("summary", resumeData.customization)}}\\end{tcolorbox}}} ${resumeData.summary} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}
  `
      : ``,
    "<<EDUCATION>>": resumeData.educations?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("education", resumeData.customization)}}\\end{tcolorbox}}} \\begin{center} \\vspace{-4pt} \\begin{tabular}{|p{3.5cm}|p{6.0cm}|p{9.5cm}${hasScoreColumn ? "|p{2.5cm}" : ""}|} \\hline \\centering \\textbf{Year} & \\centering \\textbf{Degree/Certificate} & \\centering \\textbf{Institute}${hasScoreColumn ? ` & \\centering \\textbf{CPI/\\%}` : ""} \\tabularnewline
      ${resumeData.educations
        ?.map(
          (edu) =>
            `\\hline
\\centering ${formatYear(edu.startDate)} -- ${formatYear(edu.endDate)} & \\centering ${highlightAndEscapeLatex(edu.degree)} & \\centering ${highlightAndEscapeLatex(edu.school)}${
              hasScoreColumn
                ? ` & \\centering ${highlightAndEscapeLatex(edu.score || "")}`
                : ""
            }  \\tabularnewline`,
        )
        .join(
          " ",
        )} \\hline \\end{tabular} \\end{center} \\vspace{-7pt} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
      : ``,
    "<<SKILLS>>": resumeData.skills?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("skills", resumeData.customization)}}\\end{tcolorbox}}} \\vspace{-5pt} \\begin{itemize} ${resumeData.skills
          .map(
            (skillGroup) =>
              `\\item \\textbf{${highlightAndEscapeLatex(skillGroup.label)}:} ${skillGroup.skills.map(highlightAndEscapeLatex).join(", ")}`,
          )
          .join(
            " ",
          )} \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
      : ``,
    "<<EXPERIENCE>>": resumeData.workExperiences?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("experience", resumeData.customization)}}\\end{tcolorbox}}}
                  ${resumeData.workExperiences
                    ?.map(
                      (exp) =>
                        `\\vspace{-5pt} \\begin{mybox}
             \\textbf{${highlightAndEscapeLatex(exp.position)}} $|$ ${highlightAndEscapeLatex(exp.company)} \\hfill\\hfill(\\textit{${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}})
              \\end{mybox}` + // Adds subsection with right-aligned dates
                        `\\vspace{-5pt} \\begin{itemize} ` +
                        (exp.description
                          ?.map(
                            (desc) => `\\item ${highlightAndEscapeLatex(desc)}`,
                          )
                          .join(" ") ||
                          `\\item Worked on key projects and delivered high-quality results.`) +
                        ` \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`,
                    )
                    .join(" ")}`
      : "",
    "<<PROJECTS>>": resumeData.Projects?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("projects", resumeData.customization)}}\\end{tcolorbox}}}
      ${resumeData.Projects?.map(
        (proj) =>
          `\\vspace{-5pt} \\begin{mybox}
             \\textbf{${highlightAndEscapeLatex(proj.title)}} ${proj.link ? ` | \\href{${highlightAndEscapeLatex(proj.link)}}{\\faGlobe}` : ""} ${proj.gitLink ? ` $|$ \\href{${highlightAndEscapeLatex(proj.gitLink)}}{\\faGithub}` : ""}
              \\end{mybox}` +
          `\\vspace{-5pt} \\begin{itemize} ` +
          (proj.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") || `\\item Developed using modern web technologies.`) +
          ` \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`,
      ).join(" ")}`
      : "",
    "<<POR>>": resumeData.POR?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("por", resumeData.customization)}}\\end{tcolorbox}}}
      ${resumeData.POR?.map(
        (por) =>
          `\\vspace{-5pt} \\begin{mybox}
             \\textbf{${highlightAndEscapeLatex(por.position)} at ${highlightAndEscapeLatex(por.organization)}}\\hfill\\hfill(\\textit{${formatDate(por.startDate)} - ${formatDate(por.endDate)}})
              \\end{mybox}` +
          `\\vspace{-5pt} \\begin{itemize} ` +
          (por.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") || `\\item Developed using modern web technologies.`) +
          ` \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`,
      ).join(" ")}`
      : "",
    "<<EXTRA_CURRICULARS>>": resumeData.extraCurriculars?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("extracurriculars", resumeData.customization)}}\\end{tcolorbox}}}
        \\vspace{-5pt} \\begin{itemize}
            ${resumeData.extraCurriculars.map((item) => `  \\item ${highlightAndEscapeLatex(item)}`).join("\n")}
        \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
      : ``,
    "<<ACHIEVEMENTS>>": resumeData.achievements?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("achievements", resumeData.customization)}}\\end{tcolorbox}}}
        \\vspace{-5pt} \\begin{itemize}
        ${resumeData.achievements.map((item) => `  \\item ${highlightAndEscapeLatex(item)}`).join("\n")}
        \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
      : "",

    "<<CERTIFICATIONS>>": resumeData.certifications?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${getSectionTitle("certifications", resumeData.customization)}}\\end{tcolorbox}}}
       \\vspace{-5pt}  \\begin{itemize}
        ${resumeData.certifications.map((cert) => `  \\item ${highlightAndEscapeLatex(cert)}`).join("\n")}
        \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
      : "",
    "<<CUSTOM_SECTIONS>>": resumeData.customSections?.length
      ? resumeData.customSections
          .map((section) =>
            section.title
              ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${highlightAndEscapeLatex(
                  section.title,
                )}}\\end{tcolorbox}}}\n` +
                (section.entries?.length
                  ? section.entries
                      .map((entry) => {
                        const positionLine =
                          entry.heading || entry.subheading
                            ? `\\textbf{${highlightAndEscapeLatex(entry.heading || "")}}${
                                entry.subheading
                                  ? ` $|$ ${highlightAndEscapeLatex(entry.subheading)}`
                                  : ""
                              }`
                            : "";

                        const dateRange =
                          entry.startDate || entry.endDate
                            ? `\\hfill\\hfill(\\textit{${formatDate(entry.startDate) || ""} - ${
                                formatDate(entry.endDate) || "Present"
                              }})`
                            : "";

                        const topLine =
                          positionLine || dateRange
                            ? `\\vspace{-5pt} \\begin{mybox} ${positionLine} ${dateRange} \\end{mybox}\n`
                            : "";

                        const descriptionBlock = entry.description?.length
                          ? `\\vspace{-5pt} \\begin{itemize} ${entry.description
                              .map(
                                (desc) =>
                                  `\\item ${highlightAndEscapeLatex(desc)}`,
                              )
                              .join(" ")} \\end{itemize}`
                          : "";

                        return `${topLine}${descriptionBlock}\n\\vspace{${
                          resumeData.customization?.sectionSpacing || "0pt"
                        }}`;
                      })
                      .join("\n")
                  : "")
              : "",
          )
          .join("\n")
      : "",
  };

  const sectionMap: Record<string, string> = {
    SUMMARY: placeholders["<<SUMMARY>>"],
    EXPERIENCE: placeholders["<<EXPERIENCE>>"],
    EDUCATION: placeholders["<<EDUCATION>>"],
    PROJECTS: placeholders["<<PROJECTS>>"],
    CERTIFICATIONS: placeholders["<<CERTIFICATIONS>>"],
    POR: placeholders["<<POR>>"],
    SKILLS: placeholders["<<SKILLS>>"],
    ACHIEVEMENTS: placeholders["<<ACHIEVEMENTS>>"],
    EXTRACURRICULARS: placeholders["<<EXTRA_CURRICULARS>>"],
    CUSTOMSECTIONS: placeholders["<<CUSTOM_SECTIONS>>"],
  };

  // Dynamically inject sections in order
  const sectionOrder = resumeData.customization?.sectionOrder || [
    "experience",
    "education",
    "projects",
    "certifications",
    "por",
    "skills",
    "achievements",
    "extracurriculars",
    "customsections",
  ];

  template = injectOrderedSections({
    template,
    sectionOrder,
    sectionMap,
  });

  Object.keys(placeholders).forEach((key) => {
    template = template.replace(new RegExp(key, "g"), placeholders[key]);
  });

  return template;
}

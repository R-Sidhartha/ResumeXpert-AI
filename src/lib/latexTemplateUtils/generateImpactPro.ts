import {
  highlightAndEscapeLatex,
  formatDate,
  formatYear,
  injectOrderedSections,
} from "../utils";
import { ResumeValues } from "../validation";

export function generateImpactPro(
  template: string,
  resumeData: ResumeValues,
): string {
  const highestQualification = resumeData.educations?.find(
    (edu) => edu.isHighestQualification,
  );
  const hasScoreColumn = resumeData.educations?.some((edu) => edu.score);

  const placeholders: { [key: string]: string } = {
    "<<FONT_SIZE>>": resumeData.customization?.fontSize || "10pt",
    "<<PAGE_MARGIN>>": resumeData.customization?.margin || "0.2in",
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
      ? `\\textbf{Portfolio:} \\href{${highlightAndEscapeLatex(resumeData.portfolio)}}{Portfolio}`
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
      ? ` {\\large \\textbf{\\begin{tcolorbox}\\textsc{Professional Summary}\\end{tcolorbox}}} ${resumeData.summary} \\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}
  `
      : ``,
    "<<EDUCATION>>": resumeData.educations?.length
      ? `
      {\\large \\textbf{\\begin{tcolorbox}\\textsc{Academic Qualifications}\\end{tcolorbox}}}
      \\begin{center}
      \\begin{tabular}{|p{2.5cm}|p{6.0cm}|p{8.0cm}${hasScoreColumn ? "|p{1.8cm}" : ""}|}
      \\hline
      \\centering \\textbf{Year} & \\centering \\textbf{Degree/Certificate} & \\centering \\textbf{Institute}${hasScoreColumn ? " & \\centering \\textbf{CPI/\\%}" : ""} \\tabularnewline
      ${resumeData.educations
        .map((edu) => {
          const yearRange = `${formatYear(edu.startDate) || "YYYY"} -- ${formatYear(edu.endDate) || "Present"}`;
          const degree = highlightAndEscapeLatex(edu.degree);
          const institute = highlightAndEscapeLatex(edu.school);
          const score = edu.score ? highlightAndEscapeLatex(edu.score) : "";

          return `\\hline
      \\centering ${yearRange} & \\centering ${degree} & \\centering ${institute}${hasScoreColumn ? ` & \\centering ${score}` : ""} \\tabularnewline`;
        })
        .join("\n")}
      \\hline
      \\end{tabular}
      \\end{center} \\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}`
      : "",

    "<<SKILLS>>": resumeData.skills?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{Technical Skills}\\end{tcolorbox}}} \\begin{itemize} ${resumeData.skills
          .map(
            (skillGroup) =>
              `\\item \\textbf{${highlightAndEscapeLatex(skillGroup.label)}:} ${skillGroup.skills.map(highlightAndEscapeLatex).join(", ")}`,
          )
          .join(
            " ",
          )} \\end{itemize} \\medskip \\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}`
      : ``,
    "<<EXPERIENCE>>": resumeData.workExperiences?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{Work Experience}\\end{tcolorbox}}} \\begin{itemize}
                  ${resumeData.workExperiences
                    ?.map(
                      (exp) =>
                        `
             \\item \\textbf{${highlightAndEscapeLatex(exp.position)}} $|$ ${highlightAndEscapeLatex(exp.company)} \\hfill\\hfill(\\textit{${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}})
              ` + // Adds subsection with right-aligned dates
                        `\\begin{itemize} ` +
                        (exp.description
                          ?.map(
                            (desc) => `\\item ${highlightAndEscapeLatex(desc)}`,
                          )
                          .join(" ") ||
                          `\\item Worked on key projects and delivered high-quality results.`) +
                        ` \\end{itemize} 
                        \\vspace{4pt}`,
                    )
                    .join(" ")} 
                    \\end{itemize} 
                    \\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}`
      : "",
    "<<PROJECTS>>": resumeData.Projects?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{Key Projects}\\end{tcolorbox}}} \\begin{itemize}
      ${resumeData.Projects?.map(
        (proj) =>
          `
             \\item \\textbf{${highlightAndEscapeLatex(proj.title)}} ${proj.link ? ` | \\href{${highlightAndEscapeLatex(proj.link)}}{\\faGlobe}` : ""} ${proj.gitLink ? `~ $|$ ~ \\href{${highlightAndEscapeLatex(proj.gitLink)}}{\\faGithub}` : ""} 
              ` +
          `\\begin{itemize} ` +
          (proj.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") || `\\item Developed using modern web technologies.`) +
          ` \\end{itemize} 
          \\vspace{4pt}`,
      ).join(" ")} 
      \\end{itemize} 
      \\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}`
      : "",
    "<<POR>>": resumeData.POR?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{Positions of Responsibility}\\end{tcolorbox}}} \\begin{itemize}
      ${resumeData.POR?.map(
        (por) =>
          `
             \\item \\textbf{${highlightAndEscapeLatex(por.position)} at ${highlightAndEscapeLatex(por.organization)}}\\hfill\\hfill(\\textit{${formatDate(por.startDate)} - ${formatDate(por.endDate)}})
              ` +
          `\\begin{itemize} ` +
          (por.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") || `\\item Developed using modern web technologies.`) +
          ` \\end{itemize} 
          \\vspace{4pt}`,
      ).join(" ")} 
      \\end{itemize} 
      \\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}`
      : "",
    "<<EXTRA_CURRICULARS>>": resumeData.extraCurriculars?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{Extra-Curricular Activities}\\end{tcolorbox}}}
         \\begin{itemize}
            ${resumeData.extraCurriculars.map((item) => `  \\item ${highlightAndEscapeLatex(item)}`).join("\n")}
        \\end{itemize}`
      : ``,
    "<<ACHIEVEMENTS>>": resumeData.achievements?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{Achievements}\\end{tcolorbox}}}
         \\begin{itemize}
        ${resumeData.achievements.map((item) => `  \\item ${highlightAndEscapeLatex(item)}`).join("\n")}
        \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}`
      : "",

    "<<CERTIFICATIONS>>": resumeData.certifications?.length
      ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{Courses/Certifications}\\end{tcolorbox}}}
     \\begin{center}
     \\begin{tabular}{|p{9.8cm}|p{9.8cm}|}
     \\hline
     ${resumeData.certifications
       .map((cert, idx, arr) => {
         const safeCert = highlightAndEscapeLatex(cert);
         const isLast = idx === arr.length - 1;
         const isOdd = arr.length % 2 !== 0;
         const isEndOfRow = idx % 2 === 1;

         if (isEndOfRow) return `${safeCert} \\\\ \n`;
         if (isLast && isOdd) return `${safeCert} & \\\\ \n`; // handle odd last item
         return `${safeCert} & `;
       })
       .join("")}
     \\hline
     \\end{tabular}
     \\end{center}
     \\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}`
      : "",
    "<<CUSTOM_SECTIONS>>": resumeData.customSections?.length
      ? resumeData.customSections
          .map((section) =>
            section.title
              ? `{\\large \\textbf{\\begin{tcolorbox}\\textsc{${highlightAndEscapeLatex(section.title)}}\\end{tcolorbox}}} ` +
                (section.entries?.length
                  ? section.entries
                      .map((entry) => {
                        const dateRange =
                          entry.startDate || entry.endDate
                            ? `\\textit{${formatDate(entry.startDate)} - ${formatDate(entry.endDate) || "Present"}}`
                            : "";

                        const mainLine =
                          (entry.heading
                            ? `\\textbf{${highlightAndEscapeLatex(entry.heading || "")}}`
                            : "") +
                          (entry.subheading
                            ? ` $|$ ${highlightAndEscapeLatex(entry.subheading)}`
                            : "") +
                          (entry.location
                            ? ` | ${highlightAndEscapeLatex(entry.location)}`
                            : "") +
                          (dateRange ? ` \\hfill\\hfill(${dateRange})` : "");

                        const subItems = entry.description?.length
                          ? entry.description
                              .map(
                                (desc) =>
                                  `\\item ${highlightAndEscapeLatex(desc)}`,
                              )
                              .join(" ")
                          : ``;

                        return `
                            ${mainLine ? `\\begin{itemize} \\item ${mainLine}` : ``}
                      \\begin{itemize}
                        ${subItems}
                      \\end{itemize}
                      ${mainLine ? `\\end{itemize}` : ""}
                      \\vspace{4pt}`;
                      })
                      .join(" ")
                  : "") +
                `\\vspace{${resumeData.customization?.sectionSpacing || "4pt"}}`
              : "",
          )
          .join(" ")
      : "",
  };

  const sectionMap: Record<string, string> = {
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

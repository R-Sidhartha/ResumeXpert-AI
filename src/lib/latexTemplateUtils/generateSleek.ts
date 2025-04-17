import {
  highlightAndEscapeLatex,
  formatDate,
  formatYear,
  injectOrderedSections,
  getScoreLabel,
  getSectionTitle,
} from "../utils";
import { ResumeValues } from "../validation";

export function generateSleek(
  template: string,
  resumeData: ResumeValues,
): string {
  const placeholders: { [key: string]: string } = {
    "<<FONT_SIZE>>": resumeData.customization?.fontSize || "10pt",
    "<<PAGE_MARGIN>>": resumeData.customization?.margin || "0.4in",
    "<<LINE_SPACING>>": resumeData.customization?.lineSpacing || "1.0",
    "<<SECTION_SPACING>>": resumeData.customization?.sectionSpacing || "0pt",
    "<<ITEM_SPACING>>": resumeData.customization?.itemSpacing || "2pt",
    "<<BULLET_ICON>>": resumeData.customization?.bulletIcon || "\\faAngleRight",
    "<<RGB>>": resumeData.customization?.color || "0.25, 0.5, 0.75",
    "<<WORD_SPACING>>": resumeData.customization?.wordSpacing || "3pt",
    "<<NAME>>": `${highlightAndEscapeLatex(resumeData.firstName || "John")} ~ ${highlightAndEscapeLatex(resumeData.lastName || "")}`,
    "<<EMAIL>>": highlightAndEscapeLatex(
      resumeData.email || "example@gmail.com",
    ),
    "<<PHONE>>": highlightAndEscapeLatex(resumeData.phone || "+1234567890"),
    "<<PORTFOLIO>>": resumeData.portfolio
      ? `\\faGlobe~\\href{${highlightAndEscapeLatex(resumeData.portfolio)}}{Portfolio} \\quad`
      : "",
    "<<LINKEDIN>>": highlightAndEscapeLatex(
      resumeData.linkedIn || "https://linkedin.com/in/johndoe",
    ),
    "<<GITHUB>>": highlightAndEscapeLatex(
      resumeData.github || "https://github.com/johndoe",
    ),
    "<<SUMMARY>>": resumeData.summary
      ? ` \\section{${getSectionTitle("summary", resumeData.customization)}} ${resumeData.summary} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}
  `
      : ``,
    "<<EDUCATION>>":
      resumeData.educations && resumeData.educations.length > 0
        ? `\\section{${getSectionTitle("education", resumeData.customization)}}
       ${resumeData.educations
         .map(
           (edu) =>
             `\\textbf{${highlightAndEscapeLatex(edu.degree)}} ${edu.score ? `~|~ ${getScoreLabel(edu.score)} | ${highlightAndEscapeLatex(edu.score)}` : ``} \\hfill ${formatYear(
               edu.startDate,
             )} - ${formatYear(edu.endDate) || "Present"} \\\\ ${highlightAndEscapeLatex(edu.school)}`,
         )
         .join("\\\\")}
          \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
        : "",
    "<<SKILLS>>":
      resumeData.skills && resumeData.skills?.length
        ? `\\section{${getSectionTitle("skills", resumeData.customization)}} \\begin{itemize} ` +
          resumeData.skills
            .map(
              (skillGroup) =>
                `\\item \\textbf{${highlightAndEscapeLatex(skillGroup.label)}:} ${skillGroup.skills.map(highlightAndEscapeLatex).join(", ")}`,
            )
            .join(" ") +
          ` \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
        : ``,
    "<<EXPERIENCE>>": resumeData.workExperiences?.length
      ? `\\section{${getSectionTitle("experience", resumeData.customization)}}
                ${resumeData.workExperiences
                  ?.map(
                    (exp) =>
                      `\\subsection{${highlightAndEscapeLatex(exp.position)} $|$ ${highlightAndEscapeLatex(exp.company)} \\hfill ${formatDate(exp.startDate)} - ${formatDate(exp.endDate) || "Present"}} ` +
                      `\\begin{itemize} ` +
                      (exp.description
                        ?.map(
                          (desc) => `\\item ${highlightAndEscapeLatex(desc)}`,
                        )
                        .join(" ") ||
                        `\\item Worked on key projects and delivered high-quality results.`) +
                      ` \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`,
                  )
                  .join(" ")}`
      : "",
    "<<PROJECTS>>": resumeData.Projects?.length
      ? `\\section{${getSectionTitle("projects", resumeData.customization)}}
      ${resumeData.Projects?.map(
        (proj) =>
          `\\subsection{${highlightAndEscapeLatex(proj.title)}${proj.link ? ` $|$ \\href{${highlightAndEscapeLatex(proj.link)}}{\\small\\faGlobe}` : ""}}` +
          `\\begin{itemize} ` +
          (proj.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") || `\\item Developed using modern web technologies.`) +
          ` \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`,
      ).join(" ")}`
      : "",
    "<<POR>>": resumeData.POR?.length
      ? `\\section{${getSectionTitle("por", resumeData.customization)}}
      ${resumeData.POR?.map(
        (por) =>
          `\\subsection{${highlightAndEscapeLatex(por.position)} $|$ ${highlightAndEscapeLatex(por.organization)} \\hfill ${formatDate(por.startDate)} - ${formatDate(por.endDate) || "Present"}}` +
          `\\begin{itemize} ` +
          (por.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") ||
            `\\Conducted pre-fest events by leading a team of 30`) +
          ` \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`,
      ).join(" ")}`
      : "",
    "<<EXTRA_CURRICULARS>>": resumeData.extraCurriculars?.length
      ? `\\section{${getSectionTitle("extracurriculars", resumeData.customization)}} \\begin{itemize} ${resumeData.extraCurriculars.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{itemize}`
      : ``,
    "<<ACHIEVEMENTS>>": resumeData.achievements?.length
      ? `\\section{${getSectionTitle("achievements", resumeData.customization)}} \\begin{itemize} ${resumeData.achievements.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<CERTIFICATIONS>>": resumeData.certifications?.length
      ? `\\section{${getSectionTitle("certifications", resumeData.customization)}} \\begin{itemize} ${resumeData.certifications.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<CUSTOM_SECTIONS>>": resumeData.customSections?.length
      ? resumeData.customSections
          .map((section) =>
            section.title
              ? `\\section{${highlightAndEscapeLatex(section.title)}} ${
                  section.entries?.length
                    ? section.entries
                        .map(
                          (entry) =>
                            `${
                              entry.heading
                                ? `\\subsection{${highlightAndEscapeLatex(entry.heading)} $|$ ${highlightAndEscapeLatex(
                                    entry.subheading || "",
                                  )} ${entry.startDate ? `\\hfill ${formatDate(entry.startDate) || ""} - ${formatDate(entry.endDate) || "Present"}` : ""}}`
                                : ""
                            } ` +
                            `\\begin{itemize} ${
                              entry.description
                                ?.map(
                                  (desc) =>
                                    `\\item ${highlightAndEscapeLatex(desc)}`,
                                )
                                .join(" ") || "\\item Description goes here"
                            } \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`,
                        )
                        .join(" ")
                    : ""
                }`
              : "",
          )
          .join(" ")
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
    template = template?.replace(new RegExp(key, "g"), placeholders[key]);
  });

  return template;
}

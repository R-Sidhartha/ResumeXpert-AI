import {
  highlightAndEscapeLatex,
  formatDate,
  formatYear,
  injectOrderedSections,
  getScoreLabel,
  getSectionTitle,
} from "../utils";
import { ResumeValues } from "../validation";

export function generateStacked(
  template: string,
  resumeData: ResumeValues,
): string {
  const placeholders: { [key: string]: string } = {
    "<<FONT_SIZE>>": resumeData.customization?.fontSize || "10pt",
    "<<PAGE_MARGIN>>": resumeData.customization?.margin || "0.7in",
    "<<LINE_SPACING>>": resumeData.customization?.lineSpacing || "1.1",
    "<<SECTION_SPACING>>": resumeData.customization?.sectionSpacing || "0pt",
    "<<ITEM_SPACING>>": resumeData.customization?.itemSpacing || "0pt",
    "<<BULLET_ICON>>": resumeData.customization?.bulletIcon || "$\\circ$",
    "<<RGB>>": resumeData.customization?.color || "0.25, 0.5, 0.75",
    "<<WORD_SPACING>>": resumeData.customization?.wordSpacing || "5pt",
    "<<NAME>>": `${highlightAndEscapeLatex(resumeData.firstName || "John")} ${highlightAndEscapeLatex(resumeData.lastName || "")}`,
    "<<EMAIL>>": highlightAndEscapeLatex(
      resumeData.email || "example@gmail.com",
    ),
    "<<PHONE>>": highlightAndEscapeLatex(resumeData.phone || "+1234567890"),
    "<<PORTFOLIO>>": resumeData.portfolio
      ? `\\href{${highlightAndEscapeLatex(resumeData.portfolio)}}{
    \\raisebox{-0.05\\height} \\faGlobe {Portfolio}} ~ | ~`
      : "",
    "<<LINKEDIN>>": highlightAndEscapeLatex(
      resumeData.linkedIn || "https://linkedin.com/in/johndoe",
    ),
    "<<GITHUB>>": highlightAndEscapeLatex(
      resumeData.github || "https://github.com/johndoe",
    ),
    "<<SUMMARY>>": resumeData.summary
      ? ` \\tinysection{${getSectionTitle("summary", resumeData.customization)}} \\vspace{6pt} ${resumeData.summary} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}
    `
      : ``,
    "<<EDUCATION>>":
      resumeData.educations && resumeData.educations.length > 0
        ? `\\section{${getSectionTitle("education", resumeData.customization)}}
       ${resumeData.educations
         .map(
           (edu) =>
             `\\headingBf{${highlightAndEscapeLatex(edu.degree)}}{${formatYear(
               edu.startDate,
             )} - ${formatYear(edu.endDate) || "Present"}} \\\\ \\headingIt{${highlightAndEscapeLatex(edu.school)} ${highlightAndEscapeLatex(edu.score) ? `~ ${getScoreLabel(edu.score)} | ${highlightAndEscapeLatex(edu.score) || ""}` : ""}}{}`,
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
                `\\item [\\textbf{${highlightAndEscapeLatex(skillGroup.label)}:}] ${skillGroup.skills.map(highlightAndEscapeLatex).join(", ")}`,
            )
            .join(" ") +
          ` \\end{itemize} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
        : ``,
    "<<EXPERIENCE>>": resumeData.workExperiences?.length
      ? `\\section{${getSectionTitle("experience", resumeData.customization)}}
                ${resumeData.workExperiences
                  ?.map(
                    (exp) =>
                      `\\headingBf{${highlightAndEscapeLatex(exp.position)}}{${formatDate(exp.startDate)} - ${formatDate(exp.endDate) || "Present"}} \\headingIt{${exp.company}}{}` +
                      `\\begin{resume_list} ` +
                      (exp.description
                        ?.map(
                          (desc) => `\\item ${highlightAndEscapeLatex(desc)}`,
                        )
                        .join(" ") ||
                        `\\item Worked on key projects and delivered high-quality results.`) +
                      ` \\end{resume_list} `,
                  )
                  .join(
                    " ",
                  )} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : "",
    "<<PROJECTS>>": resumeData.workExperiences?.length
      ? `\\section{${getSectionTitle("projects", resumeData.customization)}}
      ${resumeData.Projects?.map(
        (proj) =>
          `\\headingBf{${highlightAndEscapeLatex(proj.title)}${proj.link ? ` | \\href{${highlightAndEscapeLatex(proj.link)}}{\\small\\faGlobe}` : ""}}{${formatDate(proj.startDate)} - ${formatDate(proj.endDate) || "Present"}}` +
          `\\begin{resume_list} ` +
          (proj.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") || `\\item Developed using modern web technologies.`) +
          ` \\end{resume_list}`,
      ).join(
        " ",
      )} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : "",
    "<<POR>>": resumeData.POR?.length
      ? `\\section{${getSectionTitle("por", resumeData.customization)}}
      ${resumeData.POR?.map(
        (por) =>
          `\\headingBf{${highlightAndEscapeLatex(por.position)}}{${formatDate(por.startDate)} - ${formatDate(por.endDate) || "Present"}} \\headingIt{${por.organization}}{}` +
          `\\begin{resume_list} ` +
          (por.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") ||
            `\\Conducted pre-fest events by leading a team of 30`) +
          ` \\end{resume_list}`,
      ).join(
        " ",
      )} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : "",
    "<<EXTRA_CURRICULARS>>": resumeData.extraCurriculars?.length
      ? `\\section{${getSectionTitle("extracurriculars", resumeData.customization)}} \\vspace{6pt} \\begin{resume_list} ${resumeData.extraCurriculars.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{resume_list} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<ACHIEVEMENTS>>": resumeData.achievements?.length
      ? `\\section{${getSectionTitle("achievements", resumeData.customization)}} \\vspace{6pt} \\begin{resume_list} ${resumeData.achievements.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{resume_list} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<CERTIFICATIONS>>": resumeData.certifications?.length
      ? `\\section{${getSectionTitle("certifications", resumeData.customization)}} \\vspace{6pt} \\begin{resume_list} ${resumeData.certifications.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{resume_list} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
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
                                ? `\\headingBf{${highlightAndEscapeLatex(entry.heading)}}{${entry.startDate ? `${formatDate(entry.startDate) || ""} - ${formatDate(entry.endDate) || "Present"}` : ""}} ${
                                    entry.subheading
                                      ? `\\headingIt{${highlightAndEscapeLatex(
                                          entry.subheading || "",
                                        )}}{}`
                                      : ""
                                  }`
                                : ""
                            } ` +
                            `\\begin{resume_list} ${
                              entry.description
                                ?.map(
                                  (desc) =>
                                    `\\item ${highlightAndEscapeLatex(desc)}`,
                                )
                                .join(" ") || "\\item Description goes here"
                            } \\end{resume_list}`,
                        )
                        .join(" ")
                    : ""
                } \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
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

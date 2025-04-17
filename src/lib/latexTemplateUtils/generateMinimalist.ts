import {
  highlightAndEscapeLatex,
  formatDate,
  formatYear,
  injectOrderedSections,
  getScoreLabel,
  getSectionTitle,
} from "../utils";
import { ResumeValues } from "../validation";

export function generateMinimalist(
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
      ? `\\faGlobe~\\href{${highlightAndEscapeLatex(resumeData.portfolio)}}{Portfolio} \\quad \\textbar \\quad`
      : "",
    "<<LINKEDIN>>": highlightAndEscapeLatex(
      resumeData.linkedIn || "https://linkedin.com/in/johndoe",
    ),
    "<<GITHUB>>": highlightAndEscapeLatex(
      resumeData.github || "https://github.com/johndoe",
    ),
    "<<SUMMARY>>": resumeData.summary?.length
      ? `\\section{${getSectionTitle("summary", resumeData.customization)}} \\begin{onecolentry} ${highlightAndEscapeLatex(resumeData.summary)} \\end{onecolentry}`
      : ``,
    "<<EDUCATION>>": resumeData.educations?.length
      ? ` \\section{${getSectionTitle("education", resumeData.customization)}}
      ${resumeData.educations
        ?.map(
          (edu) =>
            `\\begin{twocolentry}{${edu.startDate ? `${formatYear(edu.startDate)} – ${formatYear(edu.endDate) || "present"}` : ``}} \\textbf{ ${highlightAndEscapeLatex(edu.degree)}}\\end{twocolentry} \\vspace{-5pt} \\hspace{4pt} {${edu.school} in ${highlightAndEscapeLatex(edu.branch) || "CSE"} ${edu.score ? `$|$ ${getScoreLabel(edu.score)} | ${highlightAndEscapeLatex(edu.score) || ""}` : ``}} \\vspace{2pt} `,
        )
        .join(" ")}` +
        `\\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : "",
    "<<SKILLS>>": resumeData.skills?.length
      ? `\\section{${getSectionTitle("skills", resumeData.customization)}}
\\begin{onecolentry} ` +
        resumeData.skills
          .map(
            (skillGroup) =>
              `\\textbf{${highlightAndEscapeLatex(skillGroup.label)}:} ${skillGroup.skills.map(highlightAndEscapeLatex).join(", ")}`,
          )
          .join(" ") +
        ` \\end{onecolentry} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<EXPERIENCE>>": resumeData.workExperiences?.length
      ? `\\section{${getSectionTitle("experience", resumeData.customization)}}
                ${resumeData.workExperiences
                  ?.map(
                    (exp) =>
                      `\\begin{twocolentry}{${formatDate(exp.startDate)} - ${formatDate(exp.endDate) || "Present"}}\\textbf{${exp.position}} $|$ ${exp.company} \\end{twocolentry}` +
                      `\\begin{onecolentry} \\begin{highlights} ` +
                      (exp.description
                        ?.map(
                          (desc) => `\\item ${highlightAndEscapeLatex(desc)}`,
                        )
                        .join(" ") ||
                        `\\item Worked on key projects and delivered high-quality results.`) +
                      ` \\end{highlights} \\end{onecolentry} \\vspace{${resumeData.customization?.sectionSpacing || "5pt"} }`,
                  )
                  .join(" ")}`
      : "",
    "<<PROJECTS>>": resumeData.Projects?.length
      ? `\\section{${getSectionTitle("projects", resumeData.customization)}}
      ${resumeData.Projects?.map(
        (proj) =>
          `\\begin{twocolentry}{${proj.startDate ? `${formatDate(proj.startDate) || ""} - ${formatDate(proj.endDate) || "Present"}` : ``}} {\\textbf{${proj.title}} ${highlightAndEscapeLatex(proj.link) ? `$|$ \\href{${highlightAndEscapeLatex(proj.link)}}{link \\faExternalLink}}` : ""}} \\end{twocolentry}` +
          `\\begin{onecolentry} \\begin{highlights} ` +
          (proj.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") || `\\item Developed using modern web technologies.`) +
          `\\end{highlights} \\end{onecolentry} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`,
      ).join(" ")}`
      : "",
    "<<POR>>": resumeData.POR?.length
      ? `\\section{${getSectionTitle("por", resumeData.customization)}}
      ${resumeData.POR?.map(
        (por) =>
          `\\begin{twocolentry}{${formatDate(por.startDate)} - ${formatDate(por.endDate)}}  \\textbf{${highlightAndEscapeLatex(por.position)} $|$ ${highlightAndEscapeLatex(por.organization)}} \\end{twocolentry}` +
          `\\begin{onecolentry} \\begin{highlights}` +
          (por.description
            ?.map((desc) => `\\item ${highlightAndEscapeLatex(desc)}`)
            .join(" ") ||
            `\\Conducted pre-fest events by leading a team of 30`) +
          ` \\end{highlights} \\end{onecolentry} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`,
      ).join(" ")}`
      : "",
    "<<EXTRA_CURRICULARS>>": resumeData.extraCurriculars?.length
      ? `\\section{${getSectionTitle("extracurriculars", resumeData.customization)}} \\begin{onecolentry} \\begin{highlights} ${resumeData.extraCurriculars.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{highlights} \\end{onecolentry}`
      : ``,
    "<<ACHIEVEMENTS>>": resumeData.achievements?.length
      ? `\\section{${getSectionTitle("achievements", resumeData.customization)}} \\begin{onecolentry} \\begin{highlights} ${resumeData.achievements.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{highlights} \\end{onecolentry} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<CERTIFICATIONS>>": resumeData.certifications?.length
      ? `\\section{${getSectionTitle("certifications", resumeData.customization)}} \\begin{onecolentry} \\begin{highlights} ${resumeData.certifications.map((activity) => `\\item ${highlightAndEscapeLatex(activity)}`).join(" ")} \\end{highlights} \\end{onecolentry} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<CUSTOM_SECTIONS>>": resumeData.customSections?.length
      ? resumeData.customSections
          .map((section) =>
            section.title
              ? `\\section{${highlightAndEscapeLatex(section.title)}}\n` +
                (section.entries?.length
                  ? section.entries
                      .map((entry) => {
                        const dateRange = entry.startDate
                          ? `${formatDate(entry.startDate)} - ${formatDate(entry.endDate) || "Present"}`
                          : "";

                        const headingLine =
                          entry.heading || entry.subheading
                            ? `\\textbf{${highlightAndEscapeLatex(entry.heading || "")}}` +
                              (entry.subheading
                                ? ` $|$ ${highlightAndEscapeLatex(entry.subheading)}`
                                : "")
                            : "";

                        const twocol =
                          headingLine || dateRange
                            ? `\\begin{twocolentry}{${dateRange}}${headingLine} \\end{twocolentry}`
                            : "";

                        const highlights = entry.description?.length
                          ? `\\begin{onecolentry} \\begin{highlights} ${entry.description
                              .map(
                                (desc) =>
                                  `\\item ${highlightAndEscapeLatex(desc)}`,
                              )
                              .join(" ")} \\end{highlights} \\end{onecolentry}`
                          : "";

                        return `${twocol} ${highlights} \\vspace{${
                          resumeData.customization?.sectionSpacing || "5pt"
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
    template = template?.replace(new RegExp(key, "g"), placeholders[key]);
  });

  return template;
}

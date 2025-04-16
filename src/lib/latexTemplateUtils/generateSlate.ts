import {
  highlightAndEscapeLatex,
  formatDate,
  formatYear,
  injectOrderedSections,
  getScoreLabel,
} from "../utils";
import { ResumeValues } from "../validation";

export function generateSlate(
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
      ? `\\href{${highlightAndEscapeLatex(resumeData.portfolio)}}{\\uline{Portfolio}} $|$`
      : "",
    "<<LINKEDIN>>": highlightAndEscapeLatex(
      resumeData.linkedIn || "https://linkedin.com/in/johndoe",
    ),
    "<<GITHUB>>": highlightAndEscapeLatex(
      resumeData.github || "https://github.com/johndoe",
    ),
    "<<SUMMARY>>": resumeData.summary?.length
      ? `\\section{Summary} \\small {${resumeData.summary}} \\vspace{-15pt} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<EDUCATION>>": resumeData.educations?.length
      ? ` \\section{Education} \\resumeHeadingListStart{}
      ${resumeData.educations
        ?.map(
          (edu) =>
            `\\resumeQuadHeading{${highlightAndEscapeLatex(edu.school)}}{${formatYear(edu.startDate)} – ${formatYear(edu.endDate) || "Present"}}{${highlightAndEscapeLatex(edu.degree)} in ${highlightAndEscapeLatex(edu.branch) || "CSE"}~ ${edu.score ? `| ${getScoreLabel(edu.score)}:${highlightAndEscapeLatex(edu.score) || ""}` : ``}}{} \\vspace{2pt}`,
        )
        .join(" ")}` +
        `\\resumeHeadingListEnd{} \\vspace{-15pt} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : "",
    "<<SKILLS>>": resumeData.skills?.length
      ? `\\section{Technical Skills}
\\resumeHeadingListStart{} ` +
        resumeData.skills
          .map(
            (skillGroup) =>
              `\\resumeSectionType{${highlightAndEscapeLatex(skillGroup.label)}}{:}{${skillGroup.skills.map(highlightAndEscapeLatex).join(", ")}} \\vspace{2pt}`,
          )
          .join(" ") +
        ` \\resumeHeadingListEnd{} \\vspace{-15pt} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<EXPERIENCE>>": resumeData.workExperiences?.length
      ? `\\section{Experience}
\\resumeHeadingListStart{}
${resumeData.workExperiences
  .map(
    (exp) =>
      `\\resumeQuadHeading{${highlightAndEscapeLatex(exp.position)}}{${formatDate(exp.startDate)} - ${formatDate(exp.endDate) || "Present"}}{${highlightAndEscapeLatex(exp.company)}}{${highlightAndEscapeLatex(exp.location || "Remote")}}
\\resumeItemListStart{}
${
  exp.description?.length
    ? exp.description
        .map((desc) => `\\resumeItem{${highlightAndEscapeLatex(desc)}}`)
        .join("\n")
    : ``
}
\\resumeItemListEnd{} \\vspace{4pt}`,
  )
  .join("\n")}
\\resumeHeadingListEnd{} \\vspace{-15pt}
\\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
      : "",

    "<<PROJECTS>>": resumeData.Projects?.length
      ? `\\section{Projects}
\\resumeHeadingListStart{}
${resumeData.Projects.map((proj) => {
  const link = proj.link?.trim()
    ? `\\href{${highlightAndEscapeLatex(proj.link)}}{\\uline{link}}`
    : "";

  return `\\resumeTrioHeading{${highlightAndEscapeLatex(proj.title)}}{}{${link}}
\\resumeItemListStart{}
${
  proj.description?.length
    ? proj.description
        .map((desc) => `\\resumeItem{${highlightAndEscapeLatex(desc)}}`)
        .join("\n")
    : ""
}
\\resumeItemListEnd{} \\vspace{4pt}`;
}).join("\n\n")}
\\resumeHeadingListEnd{} \\vspace{-15pt}
\\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
      : "",
    "<<POR>>": resumeData.POR?.length
      ? `\\section{Positions of Responsibility}
\\resumeHeadingListStart{}
${resumeData.POR.map((por) => {
  const dateRange = `${formatDate(por.startDate)} - ${formatDate(por.endDate)}`;
  return `\\resumeQuadHeading{${highlightAndEscapeLatex(por.position)}}{${highlightAndEscapeLatex(dateRange)}}{${highlightAndEscapeLatex(por.organization)}}{}
\\resumeItemListStart{}
${
  por.description?.length
    ? por.description
        .map((desc) => `\\resumeItem{${highlightAndEscapeLatex(desc)}}`)
        .join("\n")
    : ``
}
\\resumeItemListEnd{} \\vspace{4pt}`;
}).join("\n\n")}
\\resumeHeadingListEnd{} \\vspace{-15pt}
\\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
      : "",

    "<<EXTRA_CURRICULARS>>": resumeData.extraCurriculars?.length
      ? `\\section{Extra Curricular} \\resumeItemListStart{} ${resumeData.extraCurriculars.map((activity) => `\\resumeItem {${highlightAndEscapeLatex(activity)}}`).join(" ")} \\resumeItemListEnd{}   \\vspace{-15pt} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<ACHIEVEMENTS>>": resumeData.achievements?.length
      ? `\\section{Achievements} \\resumeItemListStart{} ${resumeData.achievements.map((activity) => `\\resumeItem {${highlightAndEscapeLatex(activity)}}`).join(" ")} \\resumeItemListEnd{} \\vspace{-15pt} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<CERTIFICATIONS>>": resumeData.certifications?.length
      ? `\\section{Certifications} \\resumeItemListStart{} ${resumeData.certifications.map((activity) => `\\resumeItem {${highlightAndEscapeLatex(activity)}}`).join(" ")} \\resumeItemListEnd{} \\vspace{-15pt} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"} }`
      : ``,
    "<<CUSTOM_SECTIONS>>": resumeData.customSections?.length
      ? resumeData.customSections
          .map((section) =>
            section.title
              ? `\\section{${highlightAndEscapeLatex(section.title)}}\n` +
                (section.entries?.length
                  ? section.entries
                      .map((entry) => {
                        const hasHeading = entry.heading;
                        const headingLine = entry.heading
                          ? `${highlightAndEscapeLatex(entry.heading)}`
                          : "";
                        const dateRange =
                          entry.startDate || entry.endDate
                            ? `${formatDate(entry.startDate) || ""}${
                                entry.endDate
                                  ? ` - ${formatDate(entry.endDate) || "Present"}`
                                  : ""
                              }`
                            : "";
                        const subheading = entry.subheading
                          ? `${highlightAndEscapeLatex(entry.subheading)}`
                          : "";
                        const location = entry.location
                          ? `${highlightAndEscapeLatex(entry.location)}`
                          : ``;

                        const headingBlock = hasHeading
                          ? `\\resumeHeadingListStart{} \\resumeQuadHeading{${headingLine}}{${dateRange ? `${dateRange}` : ""}}{${subheading}}{${location}}`
                          : "";

                        const descriptionBlock = entry.description?.length
                          ? `\\resumeItemListStart{}\n${entry.description
                              .map(
                                (desc) =>
                                  `\\item ${highlightAndEscapeLatex(desc)}`,
                              )
                              .join(
                                "\n",
                              )}\n\\resumeItemListEnd{} ${hasHeading ? `\\resumeHeadingListEnd{}` : ``}`
                          : "";

                        return `${headingBlock}${descriptionBlock}`;
                      })
                      .join("\n\\vspace{4pt}\n")
                  : "") +
                `\n \\vspace{-15pt} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}`
              : "",
          )
          .join("\n")
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
    template = template?.replace(new RegExp(key, "g"), placeholders[key]);
  });

  return template;
}

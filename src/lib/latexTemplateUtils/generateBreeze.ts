import {
  highlightAndEscapeLatex,
  formatDate,
  injectOrderedSections,
  getScoreLabel,
  getSectionTitle,
} from "../utils";
import { ResumeValues } from "../validation";

export function generateBreeze(
  template: string,
  resumeData: ResumeValues,
): string {
  const placeholders: { [key: string]: string } = {
    "<<FONT_SIZE>>": resumeData.customization?.fontSize || "10pt",
    "<<PAGE_MARGIN>>": resumeData.customization?.margin || "0.75in",
    "<<LINE_SPACING>>": resumeData.customization?.lineSpacing || "1.0",
    "<<SECTION_SPACING>>": resumeData.customization?.sectionSpacing || "0pt",
    "<<ITEM_SPACING>>": resumeData.customization?.itemSpacing || "2pt",
    "<<BULLET_ICON>>": resumeData.customization?.bulletIcon || "$\\circ$",
    "<<RGB>>": resumeData.customization?.color || "0.25, 0.5, 0.75",
    "<<WORD_SPACING>>": resumeData.customization?.wordSpacing || "3pt",
    "<<NAME>>": `${highlightAndEscapeLatex(resumeData.firstName || "John")} ~ ${highlightAndEscapeLatex(resumeData.lastName || "")}`,
    "<<EMAIL>>": highlightAndEscapeLatex(
      resumeData.email || "example@gmail.com",
    ),
    "<<PHONE>>": highlightAndEscapeLatex(resumeData.phone || "+1234567890"),
    "<<PORTFOLIO>>": resumeData.portfolio
      ? `$|$ \\href{${highlightAndEscapeLatex(resumeData.portfolio)}}{\\faGlobe \\hspace{2pt} Portfolio}`
      : "",
    "<<LINKEDIN>>": highlightAndEscapeLatex(
      resumeData.linkedIn || "https://linkedin.com/in/johndoe",
    ),
    "<<GITHUB>>": highlightAndEscapeLatex(
      resumeData.github || "https://github.com/johndoe",
    ),
    "<<SUMMARY>>": resumeData.summary
      ? ` \\section*{${getSectionTitle("summary", resumeData.customization)}} ${resumeData.summary} \\vspace{${resumeData.customization?.sectionSpacing || "0pt"}}
  `
      : ``,
    "<<EDUCATION>>": resumeData.educations?.length
      ? `\\section*{${getSectionTitle("education", resumeData.customization)}}
        \\resumeSubHeadingListStart
        ${resumeData.educations
          .map(
            (edu) => `  \\resumeSubheading
        {${highlightAndEscapeLatex(edu.school || "IITK")}}{}
        {${highlightAndEscapeLatex(edu.degree || "BTech")} ~ ${edu.score ? ` ${getScoreLabel(edu.score)} | ${highlightAndEscapeLatex(edu.score || "")}` : ``}{${formatDate(edu.startDate) || "MMM YYYY"} -- ${formatDate(edu.endDate) || "Present"}}`,
          )
          .join("\n")}
        \\resumeSubHeadingListEnd`
      : "",
    "<<SKILLS>>": resumeData.skills?.length
      ? `\\section*{${getSectionTitle("skills", resumeData.customization)}}
        \\resumeSubHeadingListStart
        ${resumeData.skills
          .map(
            (group) =>
              `\\resumeItem{${highlightAndEscapeLatex(group.label || "Prgramming languages")}}{: ${group.skills.map(highlightAndEscapeLatex).join(", ")}}`,
          )
          .join("\n")}
        \\resumeSubHeadingListEnd`
      : ``,

    "<<EXPERIENCE>>": resumeData.workExperiences?.length
      ? `\\section*{${getSectionTitle("experience", resumeData.customization)}}
            \\resumeSubHeadingListStart
            ${resumeData.workExperiences
              .map((exp) => {
                const bullets =
                  exp.description
                    ?.map(
                      (desc) =>
                        `    \\resumeItem{${highlightAndEscapeLatex(desc)}}`,
                    )
                    .join("\n") || "\\resumeItem{No description provided}";
                return `  \\resumeSubheading
            {${highlightAndEscapeLatex(exp.position || "Full Stack Developer")}}{${highlightAndEscapeLatex(exp.location || "Remote")}}
            {${highlightAndEscapeLatex(exp.company || "MicroSoft")}}{${formatDate(exp.startDate) || "Jan 2022"} -- ${formatDate(exp.endDate) || "Present"}}
        \\resumeItemListStart
        ${bullets}
        \\resumeItemListEnd`;
              })
              .join("\n")}
        \\resumeSubHeadingListEnd`
      : "",

    "<<PROJECTS>>": resumeData.Projects?.length
      ? `\\section*{\\textbf{${getSectionTitle("projects", resumeData.customization)}}}
        \\resumeSubHeadingListStart
        ${resumeData.Projects.map((proj) => {
          const bullets =
            proj.description
              ?.map(
                (desc) => `    \\resumeItem{${highlightAndEscapeLatex(desc)}}`,
              )
              .join("\n") || "\\resumeItem{No description provided}";
          return `  \\resumeSubheading
            {${highlightAndEscapeLatex(proj.title || "ReseumXpert AI")}${proj.link ? ` $|$ \\href{${highlightAndEscapeLatex(proj.link)}}{\\small\\faExternalLink}` : ""}}{}
        {}{${formatDate(proj.startDate) || "Jan 2025"} -- ${formatDate(proj.endDate) || "Present"}}
            \\resumeItemListStart
        ${bullets}
            \\resumeItemListEnd`;
        }).join("\n")}
        \\resumeSubHeadingListEnd`
      : "",
    "<<POR>>": resumeData.POR?.length
      ? `\\section*{${getSectionTitle("por", resumeData.customization)}}
            \\resumeSubHeadingListStart
        ${resumeData.POR.map((pos) => {
          const bullets =
            pos.description
              ?.map(
                (desc) => `    \\resumeItem{${highlightAndEscapeLatex(desc)}}`,
              )
              .join("\n") || "\\resumeItem{No description provided}";
          return `  \\resumeSubheading
         {${highlightAndEscapeLatex(pos.position || "Senior Executive")}}{${highlightAndEscapeLatex(pos.organization || "Udghosh IITK")}}
        {${formatDate(pos.startDate) || "Aug 2022"} -- ${formatDate(pos.endDate) || "Present"}}{}
         \\resumeItemListStart
        ${bullets}
     \\resumeItemListEnd`;
        }).join("\n")}
        \\resumeSubHeadingListEnd`
      : "",
    "<<EXTRA_CURRICULARS>>": resumeData.extraCurriculars?.length
      ? `\\section*{${getSectionTitle("extracurriculars", resumeData.customization)}}
        \\begin{itemize}
            ${resumeData.extraCurriculars.map((item) => `  \\item ${highlightAndEscapeLatex(item)}`).join("\n")}
        \\end{itemize}`
      : ``,
    "<<ACHIEVEMENTS>>": resumeData.achievements?.length
      ? `\\section*{${getSectionTitle("achievements", resumeData.customization)}}
        \\begin{itemize}
        ${resumeData.achievements.map((item) => `  \\item ${highlightAndEscapeLatex(item)}`).join("\n")}
        \\end{itemize}`
      : "",

    "<<CERTIFICATIONS>>": resumeData.certifications?.length
      ? `\\section*{${getSectionTitle("certifications", resumeData.customization)}}
        \\begin{itemize}
        ${resumeData.certifications.map((cert) => `  \\item ${highlightAndEscapeLatex(cert)}`).join("\n")}
        \\end{itemize}`
      : "",
    "<<CUSTOM_SECTIONS>>": resumeData.customSections?.length
      ? resumeData.customSections
          .map((section) => {
            if (!section.title || !section.entries?.length) return "";

            const sectionTitle = `\\section*{${highlightAndEscapeLatex(section.title)}}`;

            const [entriesWithHeading, entriesWithoutHeading] =
              section.entries.reduce(
                (acc, entry) => {
                  const hasHeading =
                    entry.heading?.trim() ||
                    entry.subheading?.trim() ||
                    entry.location?.trim();
                  if (hasHeading) {
                    acc[0].push(entry);
                  } else if (entry.description?.length) {
                    acc[1].push(entry);
                  }
                  return acc;
                },
                [[], []] as [typeof section.entries, typeof section.entries],
              );

            const onlyDescriptionBlock = entriesWithoutHeading.length
              ? `\\resumeItemListStart
${entriesWithoutHeading
  .map((entry) =>
    entry.description
      ?.map((desc) => `    \\resumeItem{${highlightAndEscapeLatex(desc)}}`)
      .join("\n"),
  )
  .join("\n")}
\\resumeItemListEnd`
              : "";

            const withHeadingBlock = entriesWithHeading.length
              ? `\\resumeSubHeadingListStart
${entriesWithHeading
  .map((entry) => {
    const title = highlightAndEscapeLatex(entry.heading || "");
    const location = highlightAndEscapeLatex(entry.location || "");
    const subheading = highlightAndEscapeLatex(entry.subheading || "");
    const dateRange = entry.startDate
      ? `${formatDate(entry.startDate) || "Jan 2022"} -- ${formatDate(entry.endDate) || "Present"}`
      : "";
    const bullets = entry.description?.length
      ? entry.description
          .map((desc) => `    \\resumeItem{${highlightAndEscapeLatex(desc)}}`)
          .join("\n")
      : "";

    return `  \\resumeSubheading
    {${title}}{${location}}
    {${subheading}}{${dateRange}}
  \\resumeItemListStart
${bullets}
  \\resumeItemListEnd`;
  })
  .join("\n")}
\\resumeSubHeadingListEnd`
              : "";

            return [sectionTitle, onlyDescriptionBlock, withHeadingBlock]
              .filter(Boolean)
              .join("\n\n");
          })
          .join("\n\n")
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

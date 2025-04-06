import { PrismaClient } from "@prisma/client";

// const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.resumeTemplate.createMany({
    data: [
      {
        template:
          "\\documentclass[10pt]{extarticle}\n" +
          "\\usepackage[margin=0.1in]{geometry}\n" +
          "\\usepackage{romannum}\n" +
          "\\usepackage[most]{tcolorbox}\n" +
          "\\usepackage{fontawesome}\n" +
          "\\usepackage{enumitem}\n" +
          "\\usepackage{hyperref}\n" +
          "\\usepackage{multicol}\n" +
          "\\setlist[itemize]{noitemsep, topsep=0pt}\n" +
          "\\addtolength{\\parskip}{-1mm}\n" +
          "\\linespread{1.03}\n" +
          "\\tcbset{\n" +
          "    frame code={},\n" +
          "    center title,\n" +
          "    left=0pt,\n" +
          "    right=0pt,\n" +
          "    top=0pt,\n" +
          "    bottom=0pt,\n" +
          "    colback=gray!50,\n" +
          "    colframe=white,\n" +
          "    width=\\dimexpr\\textwidth\\relax,\n" +
          "    enlarge left by=0mm,\n" +
          "    boxsep=3pt,\n" +
          "    arc=0pt,outer arc=0pt,\n" +
          "}\n" +
          "\\newtcolorbox{mybox}[1][]\n" +
          "{\n" +
          "  frame code={},\n" +
          "    center title,\n" +
          "    left=0pt,\n" +
          "    right=0pt,\n" +
          "    top=0pt,\n" +
          "    bottom=0pt,\n" +
          "    colback=gray!15,\n" +
          "    colframe=white,\n" +
          "    width=\\dimexpr\\textwidth\\relax,\n" +
          "    enlarge left by=0mm,\n" +
          "    boxsep=3pt,\n" +
          "    arc=0pt,outer arc=0pt,\n" +
          "}\n" +
          "\n" +
          "\\begin{document}\n" +
          "\\begin{flushleft}\n" +
          "\\noindent {\\huge\\textbf{\\VAR{name}}}\n" +
          "\\hfill\\href{\\VAR{portfolio_link}}{\\faGlobe \\hspace{2pt} Portfolio}\n" +
          "\\end{flushleft}\n" +
          "\\vspace{-5pt}\n" +
          " Bachelor of Technology \\hfill\\href{\\VAR{github_link}}{\\faGithub \\hspace{2pt} \\VAR{github_username} \\hspace{4pt} } \\href{\\VAR{linkedin_link}}{\\faLinkedin  \\hspace{2pt} \\VAR{linkedin_name}} \n" +
          "\\vspace{-3pt}\n" +
          "\\\\ \\VAR{university} \\hfill\\href{mailto:\\VAR{email}}{\\faEnvelope \\hspace{2pt} \\VAR{email}} \\hspace{2pt} \\href{tel:\\VAR{phone}}{\\faPhone \\hspace{2pt} \\VAR{phone}}\n" +
          "\\vspace{-8pt}\n" +
          "\\\\\n" +
          "\\noindent\\rule[0.5ex]{\\linewidth}{1pt}\n" +
          "\\vspace{-26pt}\n" +
          "{\\large \\textbf{\\begin{tcolorbox}\\textsc{Work Experience}\\end{tcolorbox}}}\n" +
          "\\vspace{-15pt}\n" +
          "\\VAR{work_experience}\n" +
          "\n" +
          "\\medskip\n" +
          "{\\large \\textbf{\\begin{tcolorbox}\\textsc{Key Projects}\\end{tcolorbox}}}\n" +
          "\\vspace{-15pt}\n" +
          "\\VAR{projects}\n" +
          "\n" +
          "\\medskip\n" +
          "{\\large \\textbf{\\begin{tcolorbox}\\textsc{Academic Qualifications}\\end{tcolorbox}}}\n" +
          "\\begin{center}\n" +
          "\\vspace{-6pt}\n" +
          "\\VAR{academic_qualifications}\n" +
          "\\end{center}\n" +
          "\\medskip\n" +
          "\\vspace{-1pt}\n" +
          "{\\large \\textbf{\\begin{tcolorbox}\\textsc{Technical Skills}\\end{tcolorbox}}}\n" +
          "\\vspace{-3pt}\n" +
          "\\begin{itemize}\n" +
          " \\item  \\textbf{\\VAR{skills_label_1}}: \\VAR{skills_1}\n" +
          " \\item \\textbf{\\VAR{skills_label_2}}: \\VAR{skills_2}\n" +
          " \\item \\textbf{\\VAR{skills_label_3}}: \\VAR{skills_3}   \n" +
          " \\item \\textbf{\\VAR{skills_label_4}}: \\VAR{skills_4}\n" +
          " \\item \\textbf{\\VAR{skills_label_5}}: \\VAR{skills_5}\n" +
          "\\end{itemize}  \n" +
          "\n" +
          "\\medskip\n" +
          "{\\large \\textbf{\\begin{tcolorbox}\\textsc{Positions of Responsibility}\\end{tcolorbox}}}\n" +
          "\\vspace{-15pt}\n" +
          "\\VAR{positions_of_responsibility}\n" +
          "\n" +
          "\\end{document}\n",
        subscriptionLevel: "free",
      },
    ],
  });

  console.log("Resume templates seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

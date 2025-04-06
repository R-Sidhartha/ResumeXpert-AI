"use client";

import CustomizationPanel from "./CustomizationPanel";

// import { useEffect, useRef, useState } from "react";
// import CompileButton from "./CompileButton";
// import { fetchResumeTemplate } from "@/app/(main)/editor/action";
// import { formatDate, formatYear } from "@/lib/utils";
// import { PrismaClient } from "@prisma/client";

// interface ResumeData {
//     [key: string]: string;
// }

// interface LatexResumeProps {
//     resumeData: ResumeData;
//     // templateId: string;
//     // templateCode: string;
// }

// const prisma = new PrismaClient();

export default function ResumePreview({
    // resumeData,
    pdfSrc,
    // loading
    // templateId 
    // templateCode
}: any) {
    // const [latexCode, setLatexCode] = useState<string>(``);
    // const [pdfSrc, setPdfSrc] = useState<string | null>(null);
    // const [loading, setLoading] = useState<boolean>(false);
    // const engineRef = useRef<any>(null);

    // console.log(resumeData)

    // Fetch LaTeX template from PostgreSQL
    // useEffect(() => {
    //     const fetchLatexTemplate = async () => {
    //         try {
    //             const template = await fetchResumeTemplate()

    //             if (template) {
    //                 setLatexCode(generateLatexResume(template, resumeData));
    //             }
    //         } catch (error) {
    //             console.error("Error fetching template:", error);
    //         }
    //     };

    //     fetchLatexTemplate();
    // }, [resumeData]);
    // // console.log(latexCode)

    // // Load PdfTeXEngine.js dynamically
    // useEffect(() => {
    //     console.log("Trying to load PdfTeXEngine.js...");

    //     const script = document.createElement("script");
    //     script.src = "/PdfTeXEngine.js"; // Correct path for public folder
    //     script.async = true;

    //     script.onerror = () => {
    //         console.error("Failed to load PdfTeXEngine.js");
    //         alert("Error: Could not load PdfTeXEngine.js");
    //     };

    //     script.onload = async () => {
    //         console.log("Script loaded! Checking for PdfTeXEngine...");
    //         const PdfTeXEngine = window.PdfTeXEngine;

    //         if (PdfTeXEngine) {
    //             console.log("PdfTeXEngine found on window. Initializing...");
    //             engineRef.current = new PdfTeXEngine();
    //             await engineRef.current.loadEngine(); // Initialize the engine
    //             console.log("Engine loaded and ready!");
    //         } else {
    //             console.error("PdfTeXEngine not found on window!");
    //             alert("Error: PdfTeXEngine not found after loading the script.");
    //         }
    //     };

    //     document.body.appendChild(script);
    // }, []);

    // // Compile LaTeX code
    // const handleCompile = async () => {
    //     if (!engineRef.current || !engineRef.current.isReady()) {
    //         alert("Engine is not ready yet. Please wait.");
    //         return;
    //     }

    //     setLoading(true);

    //     try {
    //         engineRef.current.flushCache();
    //         engineRef.current.writeMemFSFile("main.tex", latexCode);
    //         engineRef.current.setEngineMainFile("main.tex");
    //         const result = await engineRef.current.compileLaTeX();

    //         if (result && result.pdf) {
    //             const pdfBlob = new Blob([result.pdf], { type: "application/pdf" });
    //             setPdfSrc(URL.createObjectURL(pdfBlob));
    //         } else {
    //             console.error("No PDF output from compilation.");
    //             alert("Compilation failed: No PDF output.");
    //         }
    //     } catch (error) {
    //         console.error("Compilation error:", error);
    //         alert("Failed to compile LaTeX. Check the console for more details.");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="w-full h-full flex flex-col">
            {/* <h1 className="text-xl font-bold">LaTeX Resume Preview</h1>
            <CompileButton onClick={handleCompile} loading={loading} /> */}
            {pdfSrc && (
                <div className="flex-1 w-full h-full" >
                    <iframe
                        src={`${pdfSrc}#toolbar=0&navpanes=0`}
                        className="w-full h-full border border-gray-300"
                    ></iframe>
                </div>
            )}
        </div>
    );
}

// function generateLatexResume(template: string, resumeData: any): string {
//     const placeholders: { [key: string]: string } = {
//         "<<NAME>>": resumeData.firstName || "John Doe",
//         "<<EMAIL>>": resumeData.email || "example@gmail.com",
//         "<<PHONE>>": resumeData.phone || "+1234567890",
//         "<<PORTFOLIO>>": resumeData.portfolio || "https://example.com",
//         "<<LINKEDIN>>": resumeData.linkedin || "https://linkedin.com/in/johndoe",
//         "<<GITHUB>>": resumeData.github || "https://github.com/johndoe",
//         "<<EDUCATION>>": resumeData.educations?.map(edu =>
//             `\\textbf{${edu.degree}} \\hfill ${formatYear(edu.startDate)} - ${formatYear(edu.endDate)} \\\\ ${edu.school}`
//         ).join(" ") || "No Education",
//         "<<SKILLS>>": resumeData.skills?.length
//             ? `\\begin{itemize} ` +
//             resumeData.skills
//                 .map(skillGroup =>
//                     `\\item \\textbf{${skillGroup.label}:} ${skillGroup.skills.join(", ")}`
//                 )
//                 .join(" ") +
//             ` \\end{itemize}`
//             : `\\begin{itemize} \\item \\textbf{Programming Languages:} JavaScript, TypeScript \\item \\textbf{Frameworks:} React, Node.js \\end{itemize}`,
//         "<<EXPERIENCE>>": resumeData.workExperiences?.map(exp =>
//             `\\subsection{${exp.position} $|$ ${exp.company} \\hfill ${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}} ` + // Adds subsection with right-aligned dates
//             `\\begin{itemize} ` +
//             (exp.description?.map(desc => `\\item ${desc}`).join(" ") || `\\item Worked on key projects and delivered high-quality results.`) +
//             ` \\end{itemize}`
//         ).join(" ") || "No Experience",
//         "<<PROJECTS>>": resumeData.Projects?.map(proj =>
//             `\\subsection{${proj.title} - \\href{${proj.link}}{Project Link}} ` +
//             `\\begin{itemize} ` +
//             (proj.description?.map(desc => `\\item ${desc}`).join(" ") || `\\item Developed using modern web technologies.`) +
//             ` \\end{itemize}`
//         ).join(" ") || "No Projects",
//         "<<ExtraCurricular>>": resumeData.ExtraCurriculars?.length
//             ? `\\begin{itemize} ${resumeData.ExtraCurriculars.map(activity => `\\item ${activity}`).join(" ")} \\end{itemize}`
//             : `\\begin{itemize} \\item No Extracurricular Activities \\end{itemize}`,
//     };

//     Object.keys(placeholders).forEach(key => {
//         template = template.replace(new RegExp(key, 'g'), placeholders[key]);
//     });

//     return template;
// }


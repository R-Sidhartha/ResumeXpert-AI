"use client";

// import useUnloadWarning from "@/hooks/useUnloadWarning";
// import { ResumeServerData } from "@/lib/types";
import {
    cn,
    DEFAULT_CUSTOMIZATIONS,
    mapToResumeValues,
    // mapToResumeValues
} from "@/lib/utils";
// import { ResumeValues } from "@/lib/validation";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
// import ResumePreviewSection from "./ResumePreviewSection";
// import useAutoSaveResume from "./useAutoSaveResume";
import { steps } from "./steps";
import Footer from "./Footer";
import { CustomizationValues, ResumeValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreivewSection";
import { generateSleek } from "@/lib/latexTemplateUtils/generateSleek";
import { generateProfessional } from "@/lib/latexTemplateUtils/generateProfessional";
import useDebounce from "@/hooks/useDebounce";
import useSaveResume from "@/hooks/useSaveResume";
import useUnloadWarning from "@/hooks/useUnloadWarning";
import { ResumeServerData } from "@/lib/types";
import { savePdfSrcToDB } from "./action";
import CustomizationDialog from "@/components/CustomizationDialog";
// import { fetchResumeTemplate } from "./action";


interface ResumeEditorProps {
    resumeToEdit: ResumeServerData | null;
    // templateId: string;
    templateData: {
        name: string;
        template: string;
        id: string;
    };
    customizations: CustomizationValues | null;
    userData: {
        firstName: string;
        lastName: string;
        github: string;
        linkedIn: string;
    }
}

const templateGenerators: Record<string, (template: string, data: ResumeValues) => string> = {
    sleek: generateSleek,
    professional: generateProfessional,
    // minimalist: generateMinimalist,
    // Add other templates here...
};

export default function ResumeEditor(
    { resumeToEdit, templateData, customizations, userData }: ResumeEditorProps
) {
    const searchParams = useSearchParams();

    const [resumeData, setResumeData] = useState<ResumeValues>(
        resumeToEdit ? mapToResumeValues(resumeToEdit) : { resumeTemplateId: templateData.id, customization: customizations, firstName: userData.firstName, lastName: userData.lastName, github: userData.github, linkedIn: userData.linkedIn }
    );


    const [showSmResumePreview, setShowSmResumePreview] = useState(false);
    // const [TemplateCode, setTemplateCode] = useState<string>(templateCode);
    const [latexCode, setLatexCode] = useState<string>('');
    // const [latexCode, setLatexCode] = useState<string>(``);
    const [pdfSrc, setPdfSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const engineRef = useRef<any>(null);

    const debouncedResumeData = useDebounce(resumeData, 1000);


    const currentStep = searchParams.get("step") || steps[0].key;

    function setStep(key: string) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("step", key);
        window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    }

    // useEffect(() => {
    //     const fetchLatexTemplate = async () => {
    //         try {
    //             console.log("calling funtion")
    //             console.log(templateId)
    //             const template = await fetchResumeTemplate(templateId)

    //             if (template) {
    //                 setTemplateCode(template);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching template:", error);
    //         }
    //     };

    //     fetchLatexTemplate();
    // }, [templateId]);

    useEffect(() => {
        const generateLatex = templateGenerators[templateData.name] || (() => "");
        setLatexCode(generateLatex(templateData.template, debouncedResumeData));
        console.log(latexCode)
        return () => { };
    }, [latexCode, debouncedResumeData, templateData]);

    // Load PdfTeXEngine.js dynamically
    useEffect(() => {
        console.log("Trying to load PdfTeXEngine.js...");

        const script = document.createElement("script");
        script.src = "/PdfTeXEngine.js"; // Correct path for public folder
        script.async = true;

        script.onerror = () => {
            console.error("Failed to load PdfTeXEngine.js");
            alert("Error: Could not load PdfTeXEngine.js");
        };

        script.onload = async () => {
            console.log("Script loaded! Checking for PdfTeXEngine...");
            const PdfTeXEngine = window.PdfTeXEngine;

            if (PdfTeXEngine) {
                console.log("PdfTeXEngine found on window. Initializing...");
                engineRef.current = new PdfTeXEngine();
                await engineRef.current.loadEngine(); // Initialize the engine
                console.log("Engine loaded and ready!");
            } else {
                console.error("PdfTeXEngine not found on window!");
                alert("Error: PdfTeXEngine not found after loading the script.");
            }
        };

        document.body.appendChild(script);
    }, []);

    // Compile LaTeX code
    const handleCompile = async (resumeId: string) => {

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1100));

        if (!engineRef.current || !engineRef.current.isReady()) {
            alert("Engine is not ready yet. Please wait.");
            return;
        }

        try {
            engineRef.current.flushCache();
            engineRef.current.writeMemFSFile("main.tex", latexCode);
            engineRef.current.setEngineMainFile("main.tex");
            const result = await engineRef.current.compileLaTeX();

            if (result && result.pdf) {
                const pdfBlob = new Blob([result.pdf], { type: "application/pdf" });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setPdfSrc(pdfUrl);
                // Store in database
                // Store in database
                console.log("Saving PDF URL to DB for resume:", resumeId);
                await savePdfSrcToDB(resumeId, pdfUrl);
                console.log("PDF URL saved successfully.");
            } else {
                console.error("No PDF output from compilation.");
                alert("Compilation failed: No PDF output.");
            }
        } catch (error) {
            console.error("Compilation error:", error);
            alert("Failed to compile LaTeX. Check the console for more details.");
        } finally {
            setLoading(false);
        }
    };

    const { isSaving, hasUnsavedChanges, handleSaveAndCompile } = useSaveResume({
        resumeData: resumeData,
        handleCompile: handleCompile
    });
    useUnloadWarning(hasUnsavedChanges);




    // const FormComponent = steps.find(
    //     (step) => step.key === currentStep,
    // )?.component;

    const templateFieldMap: Record<string, string[]> = {
        "sleek": ["general-info", "personal-info", "work-experience", "education", "projects", "skills", "extra-curricular"],
        "professional": ["general-info", "personal-info", "work-experience", "projects", "education", "skills", "position-of-responsibilities"],
    };

    const allowedFields = templateFieldMap[templateData.name] || [];

    // const FormComponent = steps.find(
    //     (step) => step.key === currentStep && allowedFields.includes(step.key)
    // )?.component;

    // console.log("FormComponent", FormComponent);
    // Filter steps based on allowedFields
    const filteredSteps = steps.filter((step) => allowedFields.includes(step.key));

    // Ensure currentStep is valid
    const currentIndex = filteredSteps.findIndex(step => step.key === currentStep);
    const safeCurrentStep = currentIndex !== -1 ? currentStep : filteredSteps[0]?.key;

    // Get the Form Component
    const FormComponent = filteredSteps.find(step => step.key === safeCurrentStep)?.component;

    return (
        <div className="flex grow flex-col">
            <header className="space-y-1.5 border-b px-3 py-5 text-center">
                <h1 className="text-2xl font-bold">Design your resume</h1>
                <p className="text-sm text-muted-foreground">
                    Follow the steps below to create your resume. Your progress will be
                    saved automatically.
                </p>
            </header>
            <main className="relative grow">
                <div className="absolute bottom-0 top-0 flex w-full">
                    <div
                        className={cn(
                            "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
                            showSmResumePreview && "hidden",
                        )}
                    >
                        <Breadcrumbs currentStep={safeCurrentStep} setCurrentStep={setStep} allowedFields={allowedFields} />
                        {FormComponent && (
                            <FormComponent
                                resumeData={resumeData}
                                setResumeData={setResumeData}
                            />
                        )}
                        {/* <CustomizationPanel
                            value={{ ...DEFAULT_CUSTOMIZATIONS, ...(resumeData?.customizations || {}) }}
                            onChange={(newCustomizations) =>
                                setResumeData((prev) => ({
                                    ...prev,
                                    customizations: newCustomizations,
                                }))
                            }
                        /> */}
                    </div>
                    <div className="grow md:border-r" />
                    <ResumePreviewSection
                        resumeData={resumeData}
                        setResumeData={setResumeData}
                        // templateCode={TemplateCode}
                        className={cn(showSmResumePreview && "flex")}
                        pdfSrc={pdfSrc}
                        loading={loading}
                    />

                    <div className="absolute bottom-6 right-6 z-50">
                        <CustomizationDialog
                            value={{ ...DEFAULT_CUSTOMIZATIONS, ...(resumeData?.customization || {}) }}
                            onChange={(newCustomizations) =>
                                setResumeData((prev) => ({
                                    ...prev,
                                    customization: newCustomizations,
                                }))
                            }
                            buttonClassName="rounded-full p-3 bg-white shadow-lg hover:bg-gray-50 transition"
                            canCustomize={true}
                        />
                    </div>
                </div>
            </main>
            <Footer
                currentStep={safeCurrentStep}
                setCurrentStep={setStep}
                allowedFields={allowedFields}
                showSmResumePreview={showSmResumePreview}
                setShowSmResumePreview={setShowSmResumePreview}
                handleCompile={handleSaveAndCompile}
                loading={loading}
                isSaving={isSaving}
            />
        </div>
    );
}

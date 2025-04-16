"use client";

// import useUnloadWarning from "@/hooks/useUnloadWarning";
// import { ResumeServerData } from "@/lib/types";
import {
    cn,
    // DEFAULT_CUSTOMIZATIONS,
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
// import { savePdfSrcToDB } from "./action";
import CustomizationDialog from "@/components/CustomizationDialog";
import { generateBreeze } from "@/lib/latexTemplateUtils/generateBreeze";
import { toast } from "sonner";
import { getCustomizationForTemplate } from "@/lib/customization";
import { generateMinimalist } from "@/lib/latexTemplateUtils/generateMinimalist";
import { generateSlate } from "@/lib/latexTemplateUtils/generateSlate";
import { generateImpactPro } from "@/lib/latexTemplateUtils/generateImpactPro";
import { generateStacked } from "@/lib/latexTemplateUtils/generateStacked";


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
    breeze: generateBreeze,
    minimalist: generateMinimalist,
    slate: generateSlate,
    impactpro: generateImpactPro,
    stacked: generateStacked

};

export default function ResumeEditor(
    { resumeToEdit, templateData, customizations, userData }: ResumeEditorProps
) {
    const searchParams = useSearchParams();

    const [resumeData, setResumeData] = useState<ResumeValues>(
        resumeToEdit ? mapToResumeValues(resumeToEdit) : {
            resumeTemplateId: templateData.id, customization: customizations, firstName: userData.firstName, lastName: userData.lastName, github: userData.github, linkedIn: userData.linkedIn, customSections: [],
        }
    );
    const [showSmResumePreview, setShowSmResumePreview] = useState(false);
    // const [TemplateCode, setTemplateCode] = useState<string>(templateCode);
    const [latexCode, setLatexCode] = useState<string>('');
    // const [latexCode, setLatexCode] = useState<string>(``);
    const [pdfSrc, setPdfSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showInitialMessage, setShowInitialMessage] = useState(true);
    const [pdfBytes, setPdfBytes] = useState<Uint8Array | null>(null);

    const engineRef = useRef<any>(null);

    const debouncedResumeData = useDebounce(resumeData, 1000);

    const currentStep = searchParams.get("step") || steps[0].key;

    function setStep(key: string) {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("step", key);
        window.history.pushState(null, "", `?${newSearchParams.toString()}`);
    }

    const defaultCustomization = getCustomizationForTemplate(templateData.name);

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
    const handleCompile = async () => {
        setLoading(true);

        if (!engineRef.current || !engineRef.current.isReady()) {
            toast.warning("Engine is not ready yet. Please wait.");
            setLoading(false);
            return;
        }

        try {
            engineRef.current.flushCache();
            engineRef.current.writeMemFSFile("main.tex", latexCode);
            engineRef.current.setEngineMainFile("main.tex");

            const result = await engineRef.current.compileLaTeX();

            if (result && result.pdf) {
                setPdfBytes(result.pdf);
                const pdfBlob = new Blob([result.pdf], { type: "application/pdf" });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                setPdfSrc(pdfUrl);
                // await savePdfSrcToDB(resumeId, pdfUrl);
            } else {
                toast.error("Compilation failed: No PDF output.");
            }

            setShowInitialMessage(false);
        } catch (error) {
            console.error("Compilation error:", error);
            toast.error("Failed to compile LaTeX. Check the console for more details.");
        } finally {
            setLoading(false);
        }
    };


    const {
        isSaving,
        // isError,
        hasUnsavedChanges,
        handleSaveOnly,
    } = useSaveResume({
        resumeData: resumeData,
        setPdfBytes: setPdfBytes
    });

    useUnloadWarning(hasUnsavedChanges);


    // const FormComponent = steps.find(
    //     (step) => step.key === currentStep,
    // )?.component;

    const templateFieldMap: Record<string, string[]> = {
        "sleek": ["general-info", "resume-upload", "personal-info", "work-experience", "education", "certifications", "projects", "skills", "position-of-responsibilities", "extra-curricular", "customSection"],
        "professional": ["general-info", "resume-upload", "personal-info", "work-experience", "projects", "education", "skills", "position-of-responsibilities", "extra-curricular", "customSection"],
        "breeze": ["general-info", "resume-upload", "personal-info", "work-experience", "projects", "education", "skills", "position-of-responsibilities", "certifications", "achievements", "extra-curricular", "customSection"],
        "minimalist": ["general-info", "resume-upload", "personal-info", "work-experience", "projects", "education", "skills", "position-of-responsibilities", "certifications", "achievements", "extra-curricular", "customSection"],
        "slate": ["general-info", "resume-upload", "personal-info", "work-experience", "projects", "education", "skills", "position-of-responsibilities", "certifications", "achievements", "extra-curricular", "customSection"],
        "impactpro": ["general-info", "resume-upload", "personal-info", "work-experience", "projects", "education", "skills", "position-of-responsibilities", "certifications", "achievements", "extra-curricular", "customSection"],
        "stacked": ["general-info", "resume-upload", "personal-info", "work-experience", "projects", "education", "skills", "position-of-responsibilities", "certifications", "achievements", "extra-curricular", "customSection"],
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

    console.log("resumeData for testing", resumeData)

    return (
        <div className="flex grow flex-col">
            <header className="space-y-1.5 border-b px-3 py-5 text-center">
                <h1 className="text-2xl font-bold">Customize and finalize your resume</h1>
                <p className="text-sm text-muted-foreground">
                    Edit your information, preview the layout instantly, and click <span className="text-green-800 dark:text-green-600 font-bold">Save</span> when you&apos;re ready to save and Upload your final resume.
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
                            // setPdfBytes={setPdfBytes}
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
                        showInitialMessage={showInitialMessage}
                        resumeId={resumeToEdit?.id}
                    />

                    <div className="absolute bottom-6 right-6 z-50">
                        <CustomizationDialog
                            value={{ ...defaultCustomization, ...(resumeData?.customization || {}) }}
                            onChange={(newCustomizations) =>
                                setResumeData((prev) => ({
                                    ...prev,
                                    customization: newCustomizations,
                                }))
                            }
                            buttonClassName="rounded-full p-3 bg-white shadow-lg hover:bg-gray-50 transition"
                            canCustomize={true}
                            defaultCustomization={defaultCustomization}
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
                handleCompile={handleCompile}
                handleSave={handleSaveOnly}
                loading={loading}
                isSaving={isSaving}
                pdfBytes={pdfBytes}
            />
        </div>
    );
}

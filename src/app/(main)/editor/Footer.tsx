import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";
import { FileUserIcon, PenLineIcon } from "lucide-react";
// import Link from "next/link";
import { steps } from "./steps";
import CompileButton from "@/components/CompileButton";
import FinalSaveButton from "@/components/FinalSaveButton";

interface FooterProps {
    currentStep: string;
    setCurrentStep: (step: string) => void;
    showSmResumePreview: boolean;
    setShowSmResumePreview: (show: boolean) => void;
    loading: boolean;
    handleCompile: () => void;
    handleSave: () => Promise<string | undefined>;
    isSaving: boolean;
    allowedFields: string[];
    pdfBytes: Uint8Array | null;
}

export default function Footer({
    currentStep,
    setCurrentStep,
    showSmResumePreview,
    setShowSmResumePreview,
    handleCompile,
    handleSave,
    loading,
    isSaving,
    allowedFields,
    pdfBytes,
}: FooterProps) {
    const filteredSteps = steps.filter((step) => allowedFields.includes(step.key));
    const currentIndex = filteredSteps.findIndex((step) => step.key === currentStep);

    const previousStep = currentIndex > 0 ? filteredSteps[currentIndex - 1].key : undefined;
    const nextStep = currentIndex < filteredSteps.length - 1 ? filteredSteps[currentIndex + 1].key : undefined;

    return (
        <footer className="w-full border-t px-3 py-5">
            <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        onClick={
                            previousStep ? () => setCurrentStep(previousStep) : undefined
                        }
                        disabled={!previousStep}
                    >
                        Previous step
                    </Button>
                    <Button
                        onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
                        disabled={!nextStep}
                    >
                        Next step
                    </Button>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowSmResumePreview(!showSmResumePreview)}
                    className="md:hidden"
                    title={
                        showSmResumePreview ? "Show input form" : "Show resume preview"
                    }
                >
                    {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
                </Button>
                <div className="flex items-center gap-3">
                    <CompileButton onClick={handleCompile} loading={loading}
                        isSaving={isSaving} />
                    <FinalSaveButton
                        handleSave={handleSave}
                        pdfBytes={pdfBytes || new Uint8Array()}
                    />
                    {/* <Button variant="secondary" asChild>
                        <Link href="/resumes">Close</Link>
                    </Button> */}
                </div>
            </div>
        </footer>
    );
}

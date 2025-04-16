import ResumePreview from "./ResumePreview";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
// import BorderStyleButton from "./BorderStyleButton";
// import ColorPicker from "./ColorPicker";

interface ResumePreviewSectionProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
    className?: string;
    pdfSrc: string | null;
    loading: boolean;
    showInitialMessage?: boolean;
    resumeId?: string;
}

export default function ResumePreviewSection({
    // resumeData,
    pdfSrc,
    loading,
    //   setResumeData,
    className,
    showInitialMessage,
    resumeId
}: ResumePreviewSectionProps) {

    return (
        <div
            className={cn("group relative z-50 hidden w-full md:flex md:w-1/2", className)}
        >
            <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
                {/* <ColorPicker
          color={resumeData.colorHex}
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color.hex })
          }
        /> */}
                {/* <BorderStyleButton
          borderStyle={resumeData.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({ ...resumeData, borderStyle })
          }
        /> */}
            </div>
            <div className="flex w-full justify-center overflow-y-auto bg-secondary p-1">
                <ResumePreview
                    pdfSrc={pdfSrc || ""}
                    loading={loading}
                    showInitialMessage={showInitialMessage}
                    resumeId={resumeId}
                />
            </div>
        </div>
    );
}

"use client";

import { FileText } from "lucide-react";
import { getPdfUrl } from "./action";
import { useEffect, useState } from "react";


interface PreviewProps {
    pdfSrc?: string;
    showInitialMessage?: boolean;
    loading?: boolean;
    resumeId?: string;
}

export default function ResumePreview({
    pdfSrc,
    showInitialMessage,
    loading,
    resumeId
}: PreviewProps) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchUrl = async () => {
            if (resumeId) {
                try {
                    const url = await getPdfUrl(resumeId);
                    setPdfUrl(url);
                } catch (err) {
                    console.error("Failed to fetch PDF URL:", err);
                }
            }
        };

        fetchUrl();
    }, [resumeId]);

    const finalSrc = pdfSrc ? pdfSrc : pdfUrl;

    return (
        <div className="w-full h-full flex flex-col relative z-50">
            {loading && (
                <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-gray-50 backdrop-blur-md">
                    <div className="flex flex-col items-center space-y-4 p-6">
                        {showInitialMessage && (
                            <p className="text-center text-gray-600 text-base max-w-md px-4">
                                Hang tight! Your resume is being rendered for the first time. This might take a moment, but future previews will be lightning fast ⚡
                            </p>
                        )}
                        <div className="animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600 h-10 w-10" />
                        <p className="text-xs text-gray-400 mt-2 tracking-wide uppercase">
                            Compiling Resume...
                        </p>
                    </div>
                </div>
            )}
            {finalSrc ? (
                <div className="flex-1 w-full h-full" >
                    <iframe
                        title="Resume Preview"
                        src={`${finalSrc}`}
                        className="w-full h-full border border-gray-300 transition-opacity duration-300 opacity-100"
                    ></iframe>
                </div>
            ) : (
                <div className="flex-1 w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-500 rounded-xl border border-dashed border-gray-300 p-6 shadow-inner">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white p-4 rounded-full shadow-sm">
                            <FileText className="h-10 w-10 text-gray-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-700 dark:text-zinc-300">
                            Preview Unavailable
                        </h2>
                        <p className="text-center text-sm text-gray-500 max-w-md dark:text-zinc-300">
                            Please save and compile your resume to generate a live preview. Your changes will appear here.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}


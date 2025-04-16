"use client";

import { uploadPdfAndImage } from "@/lib/cloudinary/upload";
import { useState } from "react";
import { Button } from "./ui/button";
import { storeThumbnailInCache } from "@/lib/indexeddb/cache";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
    pdfBytes: Uint8Array;
    handleSave: () => Promise<string | undefined>; // <-- Updated to return a Promise
};

export default function FinalSaveButton({ pdfBytes, handleSave }: Props) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    console.log("pdfBytes", pdfBytes)

    const handleFinalSave = async () => {
        if (!pdfBytes || pdfBytes.length === 0) {
            toast.warning("Please preview the resume before saving.");
            return;
        }

        setLoading(true);
        try {
            // Ensure data is saved before finalizing
            const resumeId = await handleSave();
            if (!resumeId) {
                toast.error("Failed to save resume. Please try again.");
                return;
            }
            const result = await uploadPdfAndImage(resumeId, pdfBytes);
            if (!result) {
                console.warn("Upload failed or PDF was empty.");
                return;
            }
            const { imageUrl } = result;
            await storeThumbnailInCache(resumeId, imageUrl);
            toast.success("Saved successfully!");
            router.push("/my-resumes");
        } catch (err) {
            console.error(err);
            toast.error("Error during final save.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleFinalSave}
            variant="default"
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white shadow hover:bg-green-700 transition-all"
        >
            {loading ? "Saving..." : "Save"}
        </Button>
    );
}

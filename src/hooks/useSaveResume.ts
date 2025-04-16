"use client";

import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { saveResume } from "@/app/(main)/editor/action";
import { toast } from "sonner";

interface UseSaveResumeProps {
  resumeData: ResumeValues;
  setPdfBytes: (bytes: Uint8Array | null) => void;
}

export default function useSaveResume({
  resumeData,
  setPdfBytes,
}: UseSaveResumeProps) {
  const debouncedResumeData = useDebounce(resumeData, 1000);
  const [resumeId, setResumeId] = useState(resumeData.id || "");
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  const hasUnsavedChanges =
    JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData);

  useEffect(() => {
    if (!isSaving) {
      setIsError(false); // Reset error when new changes are detected
      if (hasUnsavedChanges) {
        // Invalidate existing compiled PDF when user changes resume content
        setPdfBytes(null);
      }
    }
  }, [debouncedResumeData, isSaving, setPdfBytes, hasUnsavedChanges]);

  // ✅ Save Only - Call on Finish button
  const handleSaveOnly = async () => {
    if (!hasUnsavedChanges) {
      toast.info("No changes to save.");
      return;
    }

    try {
      setIsSaving(true);
      setIsError(false);

      const newData = structuredClone(debouncedResumeData);
      // Check if there are unsaved changes and compile the resume
      const updatedResume = await saveResume({
        ...newData,
        id: resumeId,
        resumeTemplateId: newData.resumeTemplateId,
      });

      const finalResumeId = updatedResume.id;
      setResumeId((prevId) =>
        prevId !== finalResumeId ? finalResumeId : prevId,
      );
      setLastSavedData(newData);

      toast.success("Resume saved successfully!");
      return finalResumeId || "";
    } catch (error) {
      setIsError(true);
      console.error("Save error:", error);
      toast.error("Error occurred while saving the resume. Please try again.");
      return resumeId || "";
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    isError,
    hasUnsavedChanges,
    handleSaveOnly,
  };
}

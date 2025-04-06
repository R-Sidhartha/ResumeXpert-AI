"use client";

import { useEffect, useState } from "react";
import useDebounce from "@/hooks/useDebounce";
import { ResumeValues } from "@/lib/validation";
import { saveResume } from "@/app/(main)/editor/action";
import { toast } from "sonner";
// import { useSearchParams } from "next/navigation";

interface UseSaveResumeProps {
  resumeData: ResumeValues;
  handleCompile: (id: string) => void; // Function to compile after saving
}

export default function useSaveResume({
  resumeData,
  handleCompile,
}: UseSaveResumeProps) {
  // const searchParams = useSearchParams();
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
    }
  }, [debouncedResumeData, isSaving]);

  const handleSaveAndCompile = async () => {
    // if (!hasUnsavedChanges) {
    //   handleCompile(resumeId); // Compile immediately if no changes
    //   return;
    // }

    try {
      setIsSaving(true);
      setIsError(false);

      const newData = structuredClone(debouncedResumeData);

      const updatedResume = await saveResume({
        ...newData,
        id: resumeId,
        resumeTemplateId: newData.resumeTemplateId,
      });

      // Only update resumeId if it has changed
      const finalResumeId = updatedResume.id;
      setResumeId((prevId) =>
        prevId !== finalResumeId ? finalResumeId : prevId,
      );
      setLastSavedData(newData);

      // Only update URL if resumeId has changed
      // if (searchParams.get("resumeId") !== updatedResume.id) {
      //   const newSearchParams = new URLSearchParams(searchParams);
      //   newSearchParams.set("resumeId", updatedResume.id);
      //   window.history.replaceState(null, "", `?${newSearchParams.toString()}`);
      // }

      toast.success("Resume saved successfully!");
      handleCompile(finalResumeId); // Compile after successful save
    } catch (error) {
      setIsError(true);
      console.error(error);
      toast.error("Error occurred while saving the resume. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, hasUnsavedChanges, handleSaveAndCompile };
}

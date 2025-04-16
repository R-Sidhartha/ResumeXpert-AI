"use server";

import { writeFile } from "fs/promises";
import os from "os";
import path from "path";
import cloudinary from "./config";
import { getResumeById, setUrlsToDB } from "./action";
import { deletePdfFromCloudinary } from "./delete";
// import { toast } from "sonner";

export async function uploadPdfAndImage(resumeId: string, pdf: Uint8Array) {
  const publicId = `resume-${resumeId}`;

  if (!pdf || pdf.length === 0) {
    console.warn("⚠️ PDF data is empty, skipping Cloudinary upload.");
    return null;
  }

  try {
    // Get existing resume to check if an old Cloudinary file exists
    const existing = await getResumeById(resumeId);

    if (existing?.pdfPublicId) {
      try {
        await deletePdfFromCloudinary(existing.pdfPublicId);
      } catch (err) {
        console.warn("Failed to delete previous Cloudinary file", err);
      }
    }

    // Save PDF to a temporary local file
    const tempPdfPath = path.join(os.tmpdir(), `${publicId}.pdf`);
    await writeFile(tempPdfPath, Buffer.from(pdf));

    // Upload PDF using Cloudinary SDK
    const uploadResult = await cloudinary.uploader.upload(tempPdfPath, {
      resource_type: "raw",
      public_id: publicId,
      folder: "resumes",
      overwrite: true,
    });

    const pdfUrl = uploadResult.secure_url;
    const uploadedPublicId = uploadResult.public_id;

    if (!pdfUrl || !uploadedPublicId) {
      console.error("Cloudinary Upload Error", uploadResult);
      return null;
    }

    // Generate thumbnail (Cloudinary image transformation)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const imageUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/w_600,dpr_2.0,c_fit,f_png,q_auto/${pdfUrl}`;

    // Store in DB and cache
    await setUrlsToDB(resumeId, pdfUrl, imageUrl, uploadedPublicId);
    return { imageUrl };
  } catch (err) {
    console.error("Upload error:", err);
    return null;
  }
}

// function dataURItoBlob(dataURI: string) {
//   const byteString = atob(dataURI.split(",")[1]);
//   const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

//   const ab = new ArrayBuffer(byteString.length);
//   const ia = new Uint8Array(ab);
//   for (let i = 0; i < byteString.length; i++) {
//     ia[i] = byteString.charCodeAt(i);
//   }

//   return new Blob([ab], { type: mimeString });
// }

// import { createClient } from "@supabase/supabase-js";
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
// const supabase = createClient(supabaseUrl, supabaseKey);

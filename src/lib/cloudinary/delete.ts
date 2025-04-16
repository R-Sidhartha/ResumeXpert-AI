"use server";
import cloudinary from "./config";
// src/lib/cloudinary/delete.ts
// import { generateCloudinarySignature } from "./signUpload";

export async function deletePdfFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw", // Important: PDFs are 'raw' type
    });

    if (result.result !== "ok") {
      console.error("Cloudinary SDK Deletion Error:", result);
      throw new Error("Cloudinary deletion failed");
    }
  } catch (error) {
    console.error("Cloudinary deletion exception:", error);
    throw new Error("Error deleting from Cloudinary");
  }
}

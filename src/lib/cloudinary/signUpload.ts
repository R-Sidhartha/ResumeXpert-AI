// "use server";
// src/lib/cloudinary/signUpload.ts
import crypto from "crypto";

export function generateCloudinarySignature(
  publicId: string,
  timestamp: number,
) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET!;
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}`;
  return crypto
    .createHash("sha1")
    .update(stringToSign + apiSecret)
    .digest("hex");
}

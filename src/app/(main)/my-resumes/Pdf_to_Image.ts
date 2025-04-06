"use server";
import { fromBase64 } from "pdf2pic";

const options = {
  density: 100,
  saveFilename: "thumbnail",
  savePath: "./images",
  format: "png",
  width: 600,
  height: 600,
};

export async function convertPdfToImage(base64String: string) {
  try {
    if (!base64String) throw new Error("Invalid base64 data received.");

    const convert = fromBase64(base64String, options);
    const pageToConvertAsImage = 1;

    const image = await convert(pageToConvertAsImage, {
      responseType: "image",
    });

    console.log("PDF page converted to image:", image);
    return image;
  } catch (error) {
    console.error("Error converting PDF to image:", error);
    return null;
  }
}

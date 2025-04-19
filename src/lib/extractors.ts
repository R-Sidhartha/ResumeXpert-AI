"use client";
// import pdfToText from "react-pdftotext";

// export async function extractPdfText(file: File): Promise<string> {
//   try {
//     const text = await pdfToText(file);
//     return text;
//   } catch (error) {
//     console.error("Failed to extract text", error);
//     return "";
//   }
// }

export async function extractPdfText(file: File): Promise<string> {
  const pdfToText = (await import("react-pdftotext")).default;

  try {
    const text = await pdfToText(file);
    return text;
  } catch (error) {
    console.error("Failed to extract text", error);
    return "";
  }
}

// export const extractTxtText = async (file: File): Promise<string> => {
//   return new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       resolve(e.target?.result as string);
//     };
//     reader.readAsText(file);
//   });
// };

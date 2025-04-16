export {};

declare global {
  interface Window {
    PdfTeXEngine: any; // You can replace `any` with a more specific type if available
  }
}

// declare module "pdfjs-dist/build/pdf.worker.entry" {
//   const workerSrc: string;
//   export default workerSrc;
// }

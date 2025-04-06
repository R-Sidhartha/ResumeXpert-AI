export {};

declare global {
  interface Window {
    PdfTeXEngine: any; // You can replace `any` with a more specific type if available
  }
}

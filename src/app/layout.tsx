import type { Metadata } from "next";
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });
;
export const metadata: Metadata = {
  title: {
    template: "%s - ResumeXpert AI",
    absolute: "ResumeXpert AI",
  },
  description:
    "ResumeXpert AI is the easiest way to create a professional resume that will help you land your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${inter.className}`}
        >
          <ThemeProvider
            attribute={"class"}
            defaultTheme={"system"}
            enableSystem={true}
            storageKey={"theme"}
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

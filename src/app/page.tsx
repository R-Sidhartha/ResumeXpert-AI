"use client";

// import { Button } from "@/components/ui/button";
// import Link from "next/link";
import ImageLayout from "@/components/landingPage/ImageLayout";
import StepFlow from "@/components/landingPage/StepFlow";
import Testimonials from "@/components/landingPage/Testimonials";
import FeaturesSection from "@/components/landingPage/Features";
// import Header from "@/components/Header";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <Navbar />
      <section className="relative -top-40 inset-0 -z-10 bg-green-100/70 dark:bg-zinc-800 w-full h-[74vh] md:h-[80vh] lg:h-[80vh] xl:h-[110vh] rounded-t-[100px] clip-shape">
        <div className="relative z-30 top-56 gap-3 text-center mx-auto flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl lg:text-5xl tracking-tight font-bold mx-auto text-center font-poppins">
            Unlock Your Potential with <span className="text-green-700">ResumeXpert AI</span>
          </h1>
          <p className="md:mt-4 text-base md:text-lg max-w-2xl font-sans">
            Build professional, ATS-friendly resumes in minutes. Choose a template, personalize, and download instantly.
          </p>
          {/* <Button className="px-3 md:px-6 py-3 text-base md:text-lg font-semibold cursor-pointer" asChild>
            <Link href="/resume-templates" className="cursor-pointer">
              Get Started
            </Link>
          </Button> */}
        </div>
        <div className="mt-64">

          <ImageLayout />
        </div>
      </section>

      <StepFlow />
      <FeaturesSection />
      {/* <WhyChooseUs /> */}
      <Testimonials />

      <footer className=" text-zinc-800 pt-16 pb-8 w-full bg-gray-50 dark:text-zinc-200 dark:bg-zinc-900">
        {/* Footer Content */}
        <p className="text-sm text-center md:mt-0">
          © {new Date().getFullYear()} ResumeXpert AI. All rights reserved.
        </p>
      </footer>

      {/* Custom Tailwind Styles for Arbitrary Shape */}
      <style jsx>{`
        .clip-shape {
          clip-path: ellipse(80% 60% at 50% 40%);
        }
      `}</style>
    </div>
  );
}

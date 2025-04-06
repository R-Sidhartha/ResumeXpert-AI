"use client";

import Image, { StaticImageData } from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Images
import resumeBuildingImage from "@/assets/slecetResume.webp";
import aiOptimizationImage from "@/assets/fillDetails.avif";
import successImage from "@/assets/jobApply.webp";

export default function StepFlow() {
    return (
        <section className="pt-12 pb-20 bg-white w-full dark:bg-black">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-2 dark:text-zinc-200">Effortless Resume Creation in Simple Steps</h2>
                <p className="text-gray-600 dark:text-zinc-300">From template selection to AI-powered optimization—our streamlined process ensures a professional resume in minutes.</p>
            </div>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-10 items-center justify-center">
                    {steps.map((step, index) => (
                        <Step key={index} step={step} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Step Component with Scroll-Based Animation
const Step = ({ step, index }: { step: { name: string; img: StaticImageData }; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" }); // Only triggers once when scrolled into view

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: index * 0.3, ease: "easeOut" }}
            className="flex flex-col justify-center gap-6 items-center"
        >
            {/* Step Number & Text */}
            <div className="flex items-start justify-center space-x-4">
                <div className="w-10 bg-lime-700 text-white flex items-center justify-center text-lg font-bold rounded-md">
                    {index + 1}
                </div>
                <p className="text-lg text-gray-700 font-medium dark:text-zinc-300">{step.name}</p>
            </div>

            {/* Image & Arrow */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-3">
                <Image
                    src={step.img}
                    alt="Step Image"
                    width={350}
                    height={350}
                    className="rounded-lg shadow-lg transition scale-100 hover:scale-105 ease-in-out"
                />
                {index !== steps.length - 1 && (
                    <div className="md:text-xl text-3xl lg:text-3xl text-gray-800 dark:text-zinc-200">
                        <span className="block md:hidden">&darr;</span> {/* Down arrow for small screens */}
                        <span className="hidden md:block">&rarr;</span> {/* Right arrow for medium and larger screens */}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Steps Data
const steps = [
    {
        name: "Choose a professional resume template from our collection.",
        img: resumeBuildingImage,
    },
    {
        name: "Fill in your details, and let AI optimize your resume for ATS.",
        img: aiOptimizationImage,
    },
    {
        name: "Download your resume and start applying for jobs!",
        img: successImage,
    },
];

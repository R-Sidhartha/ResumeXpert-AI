"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Brain, FileText, Rocket, Star } from "lucide-react";

const features = [
    { title: "AI-Powered Optimization", description: "Let AI refine and optimize your resume for ATS and recruiters.", icon: Brain },
    { title: "Pixel-Perfect Templates", description: "Industry-leading designs for a modern, professional look.", icon: FileText },
    { title: "ATS Compatibility", description: "Our resumes are formatted to pass Applicant Tracking Systems easily.", icon: ShieldCheck },
    { title: "One-Click Apply", description: "Export your resume instantly and start applying with ease.", icon: Rocket },
    { title: "Trusted by Thousands", description: "Used by professionals worldwide to land dream jobs.", icon: Star },
];

export default function WhyChooseUs() {
    return (
        <section className="relative w-full py-20">
            <div className="max-w-6xl mx-auto px-6">
                <h2 className="text-4xl font-extrabold mb-6 text-zinc-700">Why Choose ResumeXpert AI?</h2>
                <p className="text-zinc-600 text-lg mb-12">The ultimate solution for job seekers who want to stand out.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center p-6 backdrop-blur-md rounded-xl shadow-lg text-center"
                            >
                                <Icon className=" text-lime-700 w-12 h-12 mb-4" />
                                <h3 className="text-xl text-lime-800 font-semibold">{feature.title}</h3>
                                <p className="text-gray-600 mt-2">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

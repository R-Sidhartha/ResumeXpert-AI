"use client";

import React from "react";
import clsx from "clsx";

const plans = [
    { name: "Free", price: "0", perks: ["1 Template", "3 Resumes"], bg: "bg-gray-100 dark:bg-gray-800" },
    { name: "Xpert-Pro", price: "149/-", perks: ["5 Templates", "10 Resumes", "AI Enhancement"], bg: "bg-green-600 text-white" },
    { name: "Xpert-Elite", price: "249/-", perks: ["All Templates", "Unlimited Resumes", "AI Enhancement", "ATS Checker", "Job Recommendations"], bg: "bg-gray-100 dark:bg-gray-800" },
];

const features = [
    { title: "Resume Templates", values: ["1", "5", "All"] },
    { title: "No. of Resumes", values: ["03", "10", "Unlimited"] },
    { title: "Customizations", values: ["-", "✔️", "✔️"] },
    { title: "AI Enhancement", values: ["-", "✔️", "✔️"] },
    { title: "ATS Checker", values: ["-", "-", "✔️"] },
    { title: "Job Recommendations", values: ["-", "-", "✔️"] },
];

export default function PricingPage() {

    return (
        <section className="py-10 bg-white dark:bg-gray-900 sm:py-16 lg:py-12">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-black dark:text-white sm:text-4xl lg:text-5xl">
                        Pricing & Plans
                    </h2>
                    <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                        Choose a plan that fits your goals. Access premium LaTeX templates and AI-driven enhancements to create the perfect resume.
                    </p>
                </div>

                {/* Table for Larger Screens */}
                <div className="hidden mt-16 lg:block">
                    <table className="w-full border-collapse text-gray-900 dark:text-gray-200">
                        <thead>
                            <tr className="border-b dark:border-gray-700">
                                <th className="py-8 pr-4"></th>

                                {["Free", "Xpert-Pro", "Xpert-Elite"].map((plan, i) => (
                                    <th key={i} className={clsx(
                                        "px-4 py-8 text-center",
                                        i === 1 ? "bg-green-600 text-black rounded-t-xl" : "dark:bg-gray-800"
                                    )}>
                                        <span className="text-lg font-medium">
                                            {plan}
                                        </span>
                                        <p className="mt-4 text-4xl sm:text-5xl font-bold">
                                            {i === 0 ? "0" : i === 1 ? "149/-" : "249/-"}
                                        </p>
                                        <p className="mt-2 text-sm sm:text-base">
                                            Per month
                                        </p>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {features.map((row, i) => (
                                <tr key={i} className="border-b border-gray-300 dark:border-gray-700">
                                    <td className="py-4 pr-4 font-medium">{row.title}</td>
                                    {row.values.map((value, j) => (
                                        <td key={j} className={clsx(
                                            "px-4 py-4",
                                            j === 1 ? "bg-green-600 text-black" : "dark:bg-gray-800"
                                        )}>
                                            {value === "✔️" ? (
                                                <svg className="w-5 h-5 mx-auto text-black dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                                </svg>
                                            ) : value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr>
                                <td className="py-6 pr-4"></td>
                                {["Free", "Pro", "Elite"].map((plan, i) => (
                                    <td key={i} className={clsx(
                                        "px-4 py-6 text-center",
                                        i === 1 ? "bg-green-600 text-black rounded-b-xl" : "dark:bg-gray-800"
                                    )}>
                                        <a href="#" className="inline-flex items-center font-semibold hover:underline">
                                            Get Started
                                            <svg className="w-4 h-4 ml-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                            </svg>
                                        </a>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Cards for Small Screens */}
                <div className="lg:hidden mt-10 grid gap-6 sm:grid-cols-2">
                    {plans.map((plan, i) => (
                        <div key={i} className={`p-6 rounded-lg shadow-md ${plan.bg} dark:text-white`}>
                            <h3 className="text-2xl font-semibold">{plan.name}</h3>
                            <p className="mt-2 text-4xl font-bold">{plan.price}</p>
                            <p className="text-sm">Per month</p>
                            <ul className="mt-4 space-y-2">
                                {plan.perks.map((perk, j) => (
                                    <li key={j} className="flex items-center">
                                        <svg className="w-5 h-5 text-green-700 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                        {perk}
                                    </li>
                                ))}
                            </ul>
                            <button className="mt-6 w-full py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                                Get Started
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

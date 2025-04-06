import Image from "next/image";
import { motion } from "framer-motion";
import featureImage from "@/assets/img3.png";
import featureImage2 from "@/assets/img4.png";

const features = [
    {
        icon: "🤖",
        title: "AI-Driven Resume Enhancement",
        description: "Leverage cutting-edge AI to optimize your resume, ensuring it meets industry standards and passes recruiter screening algorithms effortlessly."
    },
    {
        icon: "📄",
        title: "Precision-Designed LaTeX Templates",
        description: "Create visually stunning and highly structured resumes using LaTeX, the gold standard for professional document formatting."
    },
    {
        icon: "⚡",
        title: "ATS-Optimized Formatting",
        description: "Ensure seamless parsing by Applicant Tracking Systems (ATS) with our strategically structured resumes, increasing your chances of landing interviews."
    }
];


export default function FeaturesSection() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-zinc-900">
            <div className="max-w-6xl mx-auto text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-2 dark:text-zinc-200">Cutting-Edge Resume Technology at Your Fingertips</h2>
                <p className="text-gray-600 dark:text-zinc-300"> Create a polished, professional resume with AI optimization, premium LaTeX templates, and ATS-friendly formatting.</p>
            </div>
            <div className="container mx-auto flex flex-col lg:flex-row xl:flex-row justify-center gap-12 px-6 xl:px-12">
                {/* Features List */}
                <motion.div
                    className="lg:w-1/2 space-y-6"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="space-y-4">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-start space-x-4 p-4"
                                whileHover={{ scale: 1.05 }}
                            >
                                <span className="text-3xl">{feature.icon}</span>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-zinc-200">{feature.title}</h3>
                                    <p className="text-gray-600 w-full md:w-3/4 dark:text-zinc-300">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Image Section */}
                <motion.div
                    className="lg:w-1/2"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="relative">
                        <Image
                            src={featureImage}
                            alt="Feature Preview"
                            width={550}
                            height={450}
                            className="rounded-lg shadow-xl hover:rotate-0 -rotate-6 w-[70%] sm:w-[350px] md:w-[450px] lg:w-[600px] "
                        />
                        <Image
                            src={featureImage2}
                            alt="Feature Preview"
                            width={550}
                            height={450}
                            className="rounded-lg shadow-xl absolute top-20 lg:top-40 xl:top-44 right-16 xl:right-0 hover:rotate-0 -rotate-6 w-[70%] sm:w-[350px] md:w-[450px] lg:w-[600px] "
                        />
                    </div>

                </motion.div>
            </div>
        </section>
    );
}

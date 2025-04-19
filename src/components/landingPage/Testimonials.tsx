// import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
const testimonials = [
    {
        name: "Leslie Alexander",
        role: "Freelance React Developer",
        review:
            "ResumeXpert AI transformed my basic resume into something that truly reflected my strengths. Within a week, I started getting interview calls I never got before.",
        rating: 5,
    },
    {
        name: "Jane Cooper",
        role: "Senior UI/UX Designer",
        review:
            "I used ResumeXpert AI to revamp my resume after being stuck in the same job for years. I finally landed my dream role at a top product-based company!",
        rating: 5,
    },
    {
        name: "Robert Fox",
        role: "Full Stack Developer",
        review:
            "The AI-generated content was shockingly good. It gave me crisp, result-oriented bullet points that passed ATS checks effortlessly.",
        rating: 5,
    },
    {
        name: "Robert Fox2",
        role: "Full Stack Developer",
        review:
            "As a fresher, I had no clue how to present my projects and internships. ResumeXpert AI did it for me—and it worked!",
        rating: 5,
    },
    {
        name: "Aman S",
        role: "Final Year B.Tech Student, IIT Roorkee",
        review:
            "ResumeXpert AI generated a pixel-perfect LaTeX resume for me in under 5 minutes. It was tailored exactly to the job description—and I got the callback!",
        rating: 5,
    },
    {
        name: "Rohan T",
        role: " Data Analyst, Pune",
        review:
            "I’ve used dozens of resume builders before, but nothing comes close to the precision of ResumeXpert AI. Fast, ATS-friendly, and beautifully formatted in LaTeX.",
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="py-12 bg-gray-50 sm:py-16 lg:py-20 dark:bg-zinc-900">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <p className="text-base sm:text-lg font-medium text-gray-600 dark:text-zinc-200">25+ satisfied users — students and working professionals — who trust ResumeXpert AI for job success.</p>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900 sm:text-4xl xl:text-5xl dark:text-zinc-300">
                        Success stories from ResumeXpert AI users
                    </h2>
                </div>

                <div className="relative mt-10 md:mt-24">
                    <div className="absolute -inset-x-1 inset-y-16 md:-inset-x-2 md:-inset-y-6">
                        <div
                            className="w-full h-full max-w-5xl mx-auto rounded-3xl opacity-30 blur-lg filter"
                            style={{
                                background:
                                    "linear-gradient(90deg,  #b7fcc2  -0.55%,  #b6ff68  22.86%,  #0d8c00  48.36%,   #79b87c   73.33%, #ebff70 99.34%)",
                            }}
                        ></div>
                    </div>

                    <div className="relative mt-10 md:mt-24">
                        <Carousel className="w-full max-w-2xl lg:max-w-3xl mx-auto">
                            <CarouselContent >
                                {testimonials.map((testimonial, index) => (
                                    <CarouselItem key={index} className="p-4">
                                        <div className="flex flex-col overflow-hidden shadow-xl bg-white rounded-xl p-6 dark:bg-zinc-800">
                                            <div className="flex items-center mb-4">
                                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className="w-5 h-5 text-[#FDB241]"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <blockquote>
                                                <p className="text-lg leading-relaxed text-gray-900 dark:text-zinc-200">“{testimonial.review}”</p>
                                            </blockquote>
                                            <div className="flex items-center mt-6">
                                                {/* <Image
                                                    className="flex-shrink-0 object-cover rounded-full w-11 h-11"
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    width={150}
                                                    height={150}
                                                /> */}
                                                <div className="ml-4">
                                                    <p className="text-base font-bold text-gray-900 dark:text-zinc-200">{testimonial.name}</p>
                                                    <p className="mt-0.5 text-sm text-gray-600 dark:text-zinc-300">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="hidden md:flex justify-between items-center mt-4">
                                <CarouselPrevious />
                                <CarouselNext />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}

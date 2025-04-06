import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import img1 from "@/assets/image1.jpg"
import img2 from "@/assets/image2.jpg"
const testimonials = [
    {
        name: "Leslie Alexander",
        role: "Freelance React Developer",
        image: img1,
        review:
            "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change.",
        rating: 5,
    },
    {
        name: "Jane Cooper",
        role: "Senior UI/UX Designer",
        image: img2,
        review:
            "The customer service was excellent. The team was very helpful in setting up my account and getting everything running smoothly.",
        rating: 5,
    },
    {
        name: "Robert Fox",
        role: "Full Stack Developer",
        image: img1,
        review:
            "Absolutely love it! The intuitive design and smooth user experience make it a pleasure to use.",
        rating: 5,
    },
    {
        name: "Robert Fox2",
        role: "Full Stack Developer",
        image: img1,
        review:
            "Absolutely love it! The intuitive design and smooth user experience make it a pleasure to use.",
        rating: 5,
    },
];

export default function Testimonials() {
    return (
        <section className="py-12 bg-gray-50 sm:py-16 lg:py-20 dark:bg-zinc-900">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <p className="text-lg font-medium text-gray-600 dark:text-zinc-200">2,157 people have said how good Rareblocks</p>
                    <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl dark:text-zinc-300">
                        Our happy clients say about us
                    </h2>
                </div>

                <div className="mt-8 text-center md:mt-16">
                    <a
                        href="#"
                        className="pb-2 text-base font-bold leading-7 text-gray-900 transition-all duration-200 border-b-2 border-gray-900 hover:border-gray-600 hover:text-gray-600"
                    >
                        Check all 2,157 reviews
                    </a>
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
                        <Carousel className="w-full max-w-3xl mx-auto">
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
                                                <Image
                                                    className="flex-shrink-0 object-cover rounded-full w-11 h-11"
                                                    src={testimonial.image}
                                                    alt={testimonial.name}
                                                    width={150}
                                                    height={150}
                                                />
                                                <div className="ml-4">
                                                    <p className="text-base font-bold text-gray-900 dark:text-zinc-200">{testimonial.name}</p>
                                                    <p className="mt-0.5 text-sm text-gray-600 dark:text-zinc-300">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}

import Image from "next/image";
import img1 from "@/assets/image1.jpg";
import img2 from "@/assets/image2.jpg";

export default function ImageLayout() {
    return (
        <div className=" flex justify-center items-center">
            <div className="relative w-11/12 md:w-[80%] h-[450px] sm:h-[550px] md:h-[600px]">
                {/* Left Image (Behind Middle) */}
                <div className="absolute top-8 md:top-12 left-5 md:left-10 w-[45%] sm:w-[38%] md:w-[30%] z-0 shadow-md">
                    <Image
                        src={img1}
                        width={400}
                        height={500}
                        alt="Template 1"
                        className=" shadow-lg"
                    />
                </div>

                {/* Center Image (Largest & Front) */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[50%] sm:w-[45%] md:w-[36%] z-10 shadow-xl">
                    <Image
                        src={img2}
                        width={450}
                        height={550}
                        alt="Template 2"
                        className=" shadow-xl"
                    />
                </div>

                {/* Right Image (Behind Middle) */}
                <div className="absolute top-8 md:top-12 right-5 md:right-10 w-[45%] sm:w-[38%] md:w-[30%] z-0 shadow-md">
                    <Image
                        src={img1}
                        width={400}
                        height={500}
                        alt="Template 3"
                        className=" shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
}

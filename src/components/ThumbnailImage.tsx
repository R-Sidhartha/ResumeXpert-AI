import { useEffect, useState } from "react";
import NextImage from "next/image";
import { getThumbnailFromCache, storeThumbnailInCache } from "@/lib/indexeddb/cache";

interface ThumbnailImageProps {
    resumeId: string;
    fallbackUrl: string;
    altText: string;
}

export function ThumbnailImage({ resumeId, fallbackUrl, altText }: ThumbnailImageProps) {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadImage = async () => {
            const cached = await getThumbnailFromCache(resumeId);
            if (cached) {
                setImgSrc(cached);
                setLoading(false);
            } else {
                const img = new window.Image(); // Use global Image constructor
                img.crossOrigin = "anonymous";
                img.src = fallbackUrl;
                img.onload = async () => {
                    try {
                        const canvas = document.createElement("canvas");
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return;
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL("image/png");
                        await storeThumbnailInCache(resumeId, dataUrl);
                        setImgSrc(dataUrl);
                    } catch (err) {
                        console.error("Thumbnail caching failed", err);
                        setImgSrc(fallbackUrl);
                    }
                    setLoading(false);
                };
                img.onerror = () => {
                    setImgSrc(fallbackUrl);
                    setLoading(false);
                };
            }
        };

        if (resumeId && fallbackUrl) loadImage();
    }, [resumeId, fallbackUrl]);

    if (loading) {
        return <div className="w-full h-60 bg-gray-200 animate-pulse rounded-md" />;
    }

    return (
        <NextImage
            src={imgSrc ?? fallbackUrl}
            width={800}
            height={200}
            alt={altText}
            className="w-full cursor-pointer border border-gray-300 rounded-md"
            loading="lazy"
        />
    );
}

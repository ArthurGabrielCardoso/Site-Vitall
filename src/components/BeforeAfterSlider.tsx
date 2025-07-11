import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    className?: string;
}

export default function BeforeAfterSlider({ beforeImage, afterImage, className }: BeforeAfterSliderProps) {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = () => {
        setIsDragging(true);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(percentage, 0), 100));
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(percentage, 0), 100));
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
            document.addEventListener("touchmove", handleTouchMove);
            document.addEventListener("touchend", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("touchmove", handleTouchMove);
            document.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div
            ref={containerRef}
            className={cn("relative overflow-hidden rounded-xl cursor-grab active:cursor-grabbing", className)}
            style={{ aspectRatio: "16/10" }}
        >
            {/* Before Image */}
            <div className="absolute inset-0">
                <img
                    src={beforeImage}
                    alt="Antes"
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Antes
                </div>
            </div>

            {/* After Image */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)` }}
            >
                <img
                    src={afterImage}
                    alt="Depois"
                    className="w-full h-full object-cover"
                    draggable={false}
                />
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Depois
                </div>
            </div>

            {/* Slider Line */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-grab active:cursor-grabbing z-10"
                style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                {/* Slider Handle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200">
                    <div className="flex space-x-0.5">
                        <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                        <div className="w-0.5 h-4 bg-gray-400 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Touch/Mouse area for better UX */}
            <div
                className="absolute inset-0 z-20"
                onMouseDown={(e) => {
                    if (!containerRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
                    setIsDragging(true);
                }}
                onTouchStart={(e) => {
                    if (!containerRef.current) return;
                    const rect = containerRef.current.getBoundingClientRect();
                    const x = e.touches[0].clientX - rect.left;
                    const percentage = (x / rect.width) * 100;
                    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
                    setIsDragging(true);
                }}
            />
        </div>
    );
} 
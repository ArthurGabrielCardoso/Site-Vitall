import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

interface CounterProps {
    end: number;
    duration?: number;
    suffix?: string;
    showStar?: boolean;
}

function Counter({ end, duration = 2000, suffix = "", showStar = false }: CounterProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const counterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (counterRef.current) {
            observer.observe(counterRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isVisible, end, duration]);

    return (
        <div ref={counterRef} className="text-2xl md:text-3xl font-bold text-dental-dark flex items-center justify-center gap-2">
            {count}{suffix}
            {showStar && <Star className="h-6 w-6 text-secondary fill-secondary" />}
        </div>
    );
}

export default function StatsSection() {
    const stats = [
        {
            value: 30,
            suffix: "+",
            label: "Anos de Experiência",
            showStar: false
        },
        {
            value: 5,
            suffix: "",
            label: "Estrelas no Google",
            showStar: true
        },
        {
            value: 52,
            suffix: "+",
            label: "Avaliações Positivas",
            showStar: false
        },
        {
            value: 1000,
            suffix: "+",
            label: "Sorrisos Transformados",
            showStar: false
        }
    ];

    return (
        <section className="py-8 bg-gray-50/50">
            <div className="container">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="text-center"
                        >
                            {/* Counter */}
                            <Counter
                                end={stat.value}
                                suffix={stat.suffix}
                                duration={2500 + (index * 300)}
                                showStar={stat.showStar}
                            />

                            {/* Label */}
                            <p className="text-sm font-medium text-dental/80 mt-1">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 
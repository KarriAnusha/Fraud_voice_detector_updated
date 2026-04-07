import { useEffect, useState } from "react";

interface WaveformVisualizerProps {
  isAnimating?: boolean;
  variant?: "primary" | "success" | "warning";
}

export const WaveformVisualizer = ({ 
  isAnimating = false, 
  variant = "primary" 
}: WaveformVisualizerProps) => {
  const [bars, setBars] = useState<number[]>([]);
  const barCount = 40;

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setBars(Array.from({ length: barCount }, () => Math.random() * 100));
      }, 80);
      return () => clearInterval(interval);
    } else {
      setBars(Array.from({ length: barCount }, (_, i) => 
        30 + Math.sin(i * 0.5) * 20
      ));
    }
  }, [isAnimating]);

  const colorClass = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
  }[variant];

  return (
    <div className="flex items-end justify-center gap-[3px] h-16 px-4">
      {bars.map((height, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-100 ${colorClass}`}
          style={{ 
            height: `${Math.max(8, height)}%`,
            opacity: 0.4 + (height / 200),
          }}
        />
      ))}
    </div>
  );
};

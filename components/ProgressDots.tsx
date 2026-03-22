interface ProgressDotsProps {
  total: number;
  current: number; // 0-indexed
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={[
            "rounded-full transition-all duration-300",
            i === current
              ? "w-8 h-2 bg-[#c4b5a0]"
              : "w-2 h-2 bg-[#e5e5e5]",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

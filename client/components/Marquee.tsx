import { Sparkles } from "lucide-react";

export default function Marquee({ items }: { items: string[] }) {
  // Duplicate the list so the loop appears seamless
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-line bg-panel py-3 mb-12">
      <div className="flex w-max marquee-track">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-8 shrink-0 px-8">
            <span className="uppercase tracking-[0.15em] text-xs font-medium text-muted whitespace-nowrap">
              {item}
            </span>
            <Sparkles size={12} className="text-brass shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

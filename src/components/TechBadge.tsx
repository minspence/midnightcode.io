import {
  siNextdotjs,
  siTypescript,
  siTailwindcss,
  siSupabase,
  siSanity,
  siWebflow,
  type SimpleIcon,
} from "simple-icons";

const tools: SimpleIcon[] = [
  siNextdotjs,
  siTypescript,
  siTailwindcss,
  siSupabase,
  siSanity,
  siWebflow,
];

// Monochrome by default, brand color on hover. Near-black brand colors
// (Next.js, Sanity) fall back to white so they stay visible on the dark theme.
const brandColor = (hex: string) =>
  parseInt(hex, 16) < 0x202020 ? "#ffffff" : `#${hex}`;

export function TechBadges() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {tools.map((icon) => (
        <li
          key={icon.slug}
          style={{ "--brand": brandColor(icon.hex) } as React.CSSProperties}
          className="group flex items-center gap-3 rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-gray-200 transition-colors hover:border-(--brand) hover:text-white"
        >
          <svg
            role="img"
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-6 shrink-0 fill-gray-300 transition-colors group-hover:fill-(--brand)"
          >
            <path d={icon.path} />
          </svg>
          {icon.title}
        </li>
      ))}
    </ul>
  );
}

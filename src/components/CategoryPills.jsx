import { Grid3x3, Cpu, Palette, Music, Trophy, Utensils } from "lucide-react";

const CATEGORIES = [
  { label: "All Fests", icon: Grid3x3 },
  { label: "Technical", icon: Cpu },
  { label: "Cultural", icon: Palette },
  { label: "Music", icon: Music },
  { label: "Sports", icon: Trophy },
  { label: "Food & Culture", icon: Utensils },
];

export default function CategoryPills({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {CATEGORIES.map(({ label, icon: Icon }) => {
        const isActive = active === label;
        return (
          <button
            key={label}
            onClick={() => onChange(label)}
            className={`flex items-center gap-1.5 whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
              isActive
                ? "bg-brand-purple text-white border-brand-purple"
                : "bg-white text-gray-600 border-gray-200 hover:border-brand-purple/40"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

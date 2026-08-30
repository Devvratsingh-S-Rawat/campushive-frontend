import { Link } from "react-router-dom";
import { MapPin, Heart, Flame } from "lucide-react";
import { gradientFor } from "../utils/gradients";

/**
 * size="featured" — large hero-style card (one per row, big banner)
 * size="default"  — standard grid card
 */
export default function FestCard({ fest, size = "default" }) {
  const isFeatured = size === "featured";

  return (
    <Link
      to={`/fests/${fest.id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
    >
      <div
        className={`relative bg-gradient-to-br ${gradientFor(fest.id)} ${
          isFeatured ? "h-56" : "h-32"
        } flex flex-col justify-between p-5 overflow-hidden`}
      >
        {/* subtle decorative circles — cheap way to avoid a flat gradient rectangle */}
        <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -right-2 bottom-4 w-16 h-16 rounded-full bg-white/10" />

        <div className="flex items-center justify-between relative">
          <span className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <Flame className="w-3 h-3" /> Trending
          </span>
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {fest.event_count} {fest.event_count === 1 ? "event" : "events"}
          </span>
        </div>

        <div className="relative">
          <p className="text-white/80 text-xs font-medium uppercase tracking-wide">
            {fest.college_name}
          </p>
          <h3
            className={`font-display font-bold text-white leading-tight ${
              isFeatured ? "text-3xl" : "text-lg"
            }`}
          >
            {fest.name}
          </h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {fest.category?.slice(0, 2).map((cat) => (
            <span
              key={cat}
              className="text-xs font-medium text-brand-purple bg-violet-50 px-2 py-0.5 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>

        <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
          <MapPin className="w-3.5 h-3.5" /> {fest.location}
        </p>

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Heart className="w-3.5 h-3.5" /> {fest.interested_count} interested
          </span>
          <span className="text-sm font-semibold text-brand-purple group-hover:translate-x-0.5 transition-transform">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}

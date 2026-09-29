import { useState } from "react";
import { Play, X } from "lucide-react";

/**
 * Renders inside an event card on Fest Detail. Thumbnail strip that opens a
 * full-screen lightbox on click — pass the event's `media` array straight
 * through. Renders nothing if there's no media.
 */
export default function EventMediaGallery({ media }) {
  const [active, setActive] = useState(null); // index into media, or null

  if (!media || media.length === 0) return null;

  return (
    <>
      <div className="flex gap-2 overflow-x-auto py-2 -mx-1 px-1">
        {media.map((item, i) => (
          <button
            key={item.url}
            type="button"
            onClick={() => setActive(i)}
            className="relative flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden bg-gray-100"
          >
            {item.type === "video" ? (
              <>
                <video src={`${item.url}#t=0.1`} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <Play className="w-6 h-6 text-white fill-white" />
                </span>
              </>
            ) : (
              <img src={item.url} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <button
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-7 h-7" />
          </button>
          {media[active].type === "video" ? (
            <video
              src={media[active].url}
              controls
              autoPlay
              playsInline
              className="max-h-[85vh] max-w-full rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={media[active].url}
              alt=""
              className="max-h-[85vh] max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      )}
    </>
  );
}

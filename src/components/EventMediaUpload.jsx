import { useEffect, useState } from "react";
import { Play, X, Loader2 } from "lucide-react";
import { uploadMedia } from "../lib/cloudinary";

/**
 * Drop into the add-events form. Pick any mix of photos and videos at once —
 * each uploads to Cloudinary in parallel.
 *
 * Props:
 *   media             - current array of {url, type}, owned by the parent form
 *   onAdd             - (items) => void — append these; parent should use a
 *                       functional setState so overlapping batches can't clobber
 *                       each other
 *   onRemove          - (index) => void
 *   onUploadingChange - optional (isUploading: bool) => void — wire to disable
 *                       submit, since a file mid-upload isn't in `media` yet
 *
 * To fully reset it (clears any leftover upload error) after the form submits,
 * give it a `key` and bump the key — see EventForm in ListFest.jsx.
 */
export default function EventMediaUpload({ media, onAdd, onRemove, onUploadingChange }) {
  const [uploading, setUploading] = useState(0); // how many are still in flight
  const [error, setError] = useState(null);

  useEffect(() => {
    onUploadingChange?.(uploading > 0);
  }, [uploading, onUploadingChange]);

  async function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    e.target.value = ""; // lets the same file be picked again later if removed

    setError(null);
    setUploading((n) => n + files.length);

    const results = await Promise.allSettled(files.map(uploadMedia));
    const succeeded = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
    const failed = results.filter((r) => r.status === "rejected");

    if (succeeded.length > 0) onAdd(succeeded);
    if (failed.length > 0) {
      setError(
        `${failed.length} file${failed.length > 1 ? "s" : ""} failed: ${failed[0].reason?.message || "upload error"}`
      );
    }
    setUploading((n) => n - files.length);
  }

  return (
    <div>
      <label className="text-xs font-medium text-gray-500">Photos &amp; videos</label>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleFileChange}
        className="w-full text-sm mt-1 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-purple file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-purple-dark"
      />

      {uploading > 0 && (
        <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading {uploading}…
        </p>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}

      {media.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {media.map((item, i) => (
            <div key={item.url} className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100">
              {item.type === "video" ? (
                <video src={`${item.url}#t=0.1`} className="h-full w-full object-cover" muted playsInline preload="metadata" />
              ) : (
                <img src={item.url} alt="" className="h-full w-full object-cover" />
              )}
              {item.type === "video" && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                  <Play className="w-5 h-5 text-white fill-white" />
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

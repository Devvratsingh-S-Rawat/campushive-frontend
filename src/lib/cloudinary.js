// Uploads a file straight to Cloudinary from the browser using an unsigned
// upload preset (your backend never touches the binary). The /auto/upload
// endpoint detects image vs video on its own, so one preset handles both.
// Free plan caps video at 100MB/file — fine for short event clips.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export async function uploadMedia(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary isn't configured — set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Upload failed: ${file.name}`);
  }

  const data = await res.json();
  return { url: data.secure_url, type: data.resource_type === "video" ? "video" : "image" };
}

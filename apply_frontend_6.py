import base64
from pathlib import Path

FILES = {
    "vercel.json": """ewogICIkc2NoZW1hIjogImh0dHBzOi8vb3BlbmFwaS52ZXJjZWwuc2gvdmVyY2VsLmpzb24iLAogICJyZXdyaXRlcyI6IFsKICAgIHsgInNvdXJjZSI6ICIvKC4qKSIsICJkZXN0aW5hdGlvbiI6ICIvaW5kZXguaHRtbCIgfQogIF0KfQo=""",
}

updated = []
for path, b64 in FILES.items():
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_bytes(base64.b64decode(b64))
    updated.append(path)

print(f"Updated {len(updated)} files:")
for u in updated:
    print(f"  {u}")
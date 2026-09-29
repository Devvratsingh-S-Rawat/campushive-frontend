import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PartyPopper, Plus, CheckCircle2, ArrowRight } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import EventMediaUpload from "../components/EventMediaUpload";

const CATEGORIES = ["Technical", "Cultural", "Music", "Sports", "Food & Culture"];

function EventForm({ festId, onAdded }) {
  const [form, setForm] = useState({
    name: "", category: "", description: "", event_date: "", location: "",
    max_participants: "", entry_fee: "0", media: [],
  });
  const [busy, setBusy] = useState(false);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0); // bumped to reset the uploader after each add
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api.post(`/fests/${festId}/events`, {
        name: form.name,
        category: form.category || null,
        description: form.description || null,
        event_date: form.event_date,
        location: form.location || null,
        max_participants: form.max_participants ? Number(form.max_participants) : null,
        entry_fee: Number(form.entry_fee) || 0,
        media: form.media,
      });
      onAdded(res.data);
      setUploaderKey((k) => k + 1);
      setForm({ name: "", category: "", description: "", event_date: "", location: "", max_participants: "", entry_fee: "0", media: [] });
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't add that event.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500">Event name</label>
          <input required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-brand-purple"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Category</label>
          <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-brand-purple"
            value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">—</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500">Description</label>
        <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-brand-purple"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500">Date &amp; time</label>
          <input required type="datetime-local" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-brand-purple"
            value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Location</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-brand-purple"
            value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-500">Max participants</label>
          <input type="number" min="1" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-brand-purple"
            value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: e.target.value })} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Entry fee (₹, 0 = free)</label>
          <input type="number" min="0" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 outline-none focus:border-brand-purple"
            value={form.entry_fee} onChange={(e) => setForm({ ...form, entry_fee: e.target.value })} />
        </div>
      </div>

      <EventMediaUpload
        key={uploaderKey}
        media={form.media}
        onAdd={(items) => setForm((f) => ({ ...f, media: [...f.media, ...items] }))}
        onRemove={(i) => setForm((f) => ({ ...f, media: f.media.filter((_, idx) => idx !== i) }))}
        onUploadingChange={setMediaUploading}
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button type="submit" disabled={busy || mediaUploading}
        className="flex items-center gap-1.5 bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors disabled:opacity-60">
        <Plus className="w-4 h-4" /> {mediaUploading ? "Waiting for upload…" : busy ? "Adding…" : "Add Event"}
      </button>
    </form>
  );
}

export default function ListFest() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState("fest"); // "fest" | "events"
  const [fest, setFest] = useState(null);
  const [addedEvents, setAddedEvents] = useState([]);
  const [festForm, setFestForm] = useState({
    name: "", college_name: "", location: "", description: "", category: [],
    start_date: "", end_date: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  function toggleCategory(cat) {
    setFestForm((f) => ({
      ...f,
      category: f.category.includes(cat) ? f.category.filter((c) => c !== cat) : [...f.category, cat],
    }));
  }

  async function handleCreateFest(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Accounts created via Google sign-in have no college_name on file,
      // so fall back to what was typed into the form for those.
      const res = await api.post("/fests", {
        ...festForm,
        college_name: user.college_name || festForm.college_name.trim(),
      });
      setFest(res.data);
      setStep("events");
    } catch (err) {
      setError(err.response?.data?.detail || "Couldn't create the fest.");
    } finally {
      setBusy(false);
    }
  }

  if (user?.role !== "college_rep") {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6 text-gray-400">
        Sign in as a college rep to list a fest.
      </div>
    );
  }

  if (step === "events") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">{fest.name} is live</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-brand-ink mb-1">Now add some events</h1>
          <p className="text-gray-500 text-sm mb-6">
            A fest needs at least one event before students can register. Add as many as you like.
          </p>

          {addedEvents.length > 0 && (
            <div className="space-y-2 mb-6">
              {addedEvents.map((ev) => (
                <div key={ev.id} className="flex items-center gap-2 bg-violet-50 text-brand-purple text-sm font-medium rounded-lg px-4 py-2.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {ev.name}
                </div>
              ))}
            </div>
          )}

          <EventForm festId={fest.id} onAdded={(ev) => setAddedEvents((list) => [...list, ev])} />

          <button
            onClick={() => navigate("/dashboard")}
            disabled={addedEvents.length === 0}
            className="flex items-center gap-1.5 justify-center w-full mt-4 bg-brand-orange hover:bg-brand-orange-dark disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold rounded-full py-2.5 transition-colors"
          >
            Done — go to dashboard <ArrowRight className="w-4 h-4" />
          </button>
          {addedEvents.length === 0 && (
            <p className="text-center text-xs text-gray-400 mt-2">Add at least one event to continue.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 text-brand-purple mb-2">
          <PartyPopper className="w-5 h-5" />
          <span className="font-semibold text-sm">{user.college_name || "College Rep"}</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-brand-ink mb-6">List Your Fest</h1>

        <form onSubmit={handleCreateFest} className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Fest name</label>
            <input required placeholder="Techfest 2026"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple"
              value={festForm.name} onChange={(e) => setFestForm({ ...festForm, name: e.target.value })} />
          </div>

          {!user.college_name && (
            <div>
              <label className="text-xs font-medium text-gray-500">College name</label>
              <input required placeholder="Your college's full name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple"
                value={festForm.college_name} onChange={(e) => setFestForm({ ...festForm, college_name: e.target.value })} />
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-gray-500">Location</label>
            <input required placeholder="Mumbai, Maharashtra"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple"
              value={festForm.location} onChange={(e) => setFestForm({ ...festForm, location: e.target.value })} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500">Description</label>
            <textarea rows={3} placeholder="What's this fest about?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple resize-none"
              value={festForm.description} onChange={(e) => setFestForm({ ...festForm, description: e.target.value })} />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Categories</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    festForm.category.includes(cat)
                      ? "bg-brand-purple text-white border-brand-purple"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500">Start date</label>
              <input required type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple"
                value={festForm.start_date} onChange={(e) => setFestForm({ ...festForm, start_date: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">End date</label>
              <input required type="date"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm mt-1 outline-none focus:border-brand-purple"
                value={festForm.end_date} onChange={(e) => setFestForm({ ...festForm, end_date: e.target.value })} />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button type="submit" disabled={busy}
            className="w-full bg-brand-purple hover:bg-brand-purple-dark text-white font-semibold rounded-full py-2.5 transition-colors disabled:opacity-60">
            {busy ? "Creating…" : "Create Fest"}
          </button>
        </form>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, MapPin, Calendar, Heart } from "lucide-react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { gradientFor } from "../utils/gradients";
import InsightsCard from "../components/InsightsCard";

function formatDateRange(start, end) {
  const opts = { day: "numeric", month: "short" };
  const s = new Date(start).toLocaleDateString("en-IN", opts);
  const e = new Date(end).toLocaleDateString("en-IN", opts);
  return s === e ? s : `${s} — ${e}`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [fests, setFests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "college_rep") return;
    api
      .get("/fests/mine")
      .then((res) => setFests(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (user?.role !== "college_rep") {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-6">
        <p className="text-gray-400">Sign in as a college rep to see your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-brand-ink">Your Fests</h1>
            <p className="text-gray-500 text-sm">{user.college_name}</p>
          </div>
          <Link
            to="/list-fest"
            className="flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-colors flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> List a Fest
          </Link>
        </div>

        {loading && (
          <div className="space-y-4">
            {[0, 1].map((i) => (
              <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && fests.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-500 mb-3">You haven't listed a fest yet.</p>
            <Link to="/list-fest" className="text-brand-purple font-semibold text-sm">
              List your first fest →
            </Link>
          </div>
        )}

        <div className="space-y-5">
          {fests.map((fest) => (
            <div key={fest.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className={`bg-gradient-to-br ${gradientFor(fest.id)} p-5`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to={`/fests/${fest.id}`} className="font-display text-xl font-bold text-white hover:underline">
                      {fest.name}
                    </Link>
                    <div className="flex flex-wrap gap-3 text-white/80 text-xs mt-2">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {fest.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDateRange(fest.start_date, fest.end_date)}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 text-white flex-shrink-0">
                    <div className="text-center">
                      <p className="font-bold">{fest.event_count}</p>
                      <p className="text-white/70 text-xs">events</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{fest.interested_count}</p>
                      <p className="text-white/70 text-xs">interested</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <InsightsCard festId={fest.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

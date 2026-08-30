import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

// TODO: this rep's own fests are already fetched below from GET /fests/mine —
// still needs the real dashboard design. The "List Your Fest" form lives at
// /list-fest (add that route + page). Each fest card should link to its AI
// insights via GET /fests/{id}/insights — make that the centerpiece, it's
// the project's differentiator.
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
    return <p className="p-8 text-gray-400">Sign in as a college rep to see your dashboard.</p>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className="text-xs text-gray-400 mb-2">
        Placeholder page — real dashboard design still needed here
      </p>
      <h1 className="text-2xl font-bold text-brand-purple mb-4">Your fests</h1>

      {loading && <p>Loading…</p>}

      <ul className="space-y-3">
        {fests.map((fest) => (
          <li key={fest.id} className="border border-gray-200 rounded-lg p-4">
            <Link to={`/fests/${fest.id}`} className="font-semibold text-brand-purple">
              {fest.name}
            </Link>
            <p className="text-sm text-gray-500">
              {fest.event_count} events · {fest.interested_count} interested
            </p>
            <p className="text-xs text-gray-400 mt-1">
              AI insights card goes here — GET /fests/{fest.id}/insights
            </p>
          </li>
        ))}
        {!loading && fests.length === 0 && (
          <p className="text-gray-400">
            No fests yet — build the "List Your Fest" form (POST /fests) to create one.
          </p>
        )}
      </ul>
    </div>
  );
}

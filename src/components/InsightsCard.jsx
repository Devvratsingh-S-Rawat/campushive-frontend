import { useState } from "react";
import { Sparkles, TrendingUp, Loader2 } from "lucide-react";
import { api } from "../api/client";

export default function InsightsCard({ festId }) {
  const [state, setState] = useState("idle"); // idle | loading | loaded | error
  const [data, setData] = useState(null);

  async function loadInsights() {
    setState("loading");
    try {
      const res = await api.get(`/fests/${festId}/insights`);
      setData(res.data);
      setState("loaded");
    } catch {
      setState("error");
    }
  }

  if (state === "idle") {
    return (
      <button
        onClick={loadInsights}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-violet-200 hover:border-brand-purple hover:bg-violet-50 text-brand-purple text-sm font-semibold rounded-xl py-3 transition-colors"
      >
        <Sparkles className="w-4 h-4" /> Generate AI Insights
      </button>
    );
  }

  if (state === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 bg-violet-50 text-brand-purple text-sm font-medium rounded-xl py-4">
        <Loader2 className="w-4 h-4 animate-spin" /> Analyzing registration data…
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="text-center py-3">
        <p className="text-sm text-red-500 mb-2">Couldn't generate insights right now.</p>
        <button onClick={loadInsights} className="text-sm font-semibold text-brand-purple">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <Sparkles className="w-4 h-4 text-brand-purple" />
        <h4 className="font-display font-bold text-brand-purple text-sm">AI-Powered Insights</h4>
      </div>

      <ul className="space-y-2 mb-3">
        {data.insights.map((insight, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-700">
            <span className="text-brand-purple mt-0.5">•</span>
            {insight}
          </li>
        ))}
      </ul>

      {data.stats.total_interested > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-3 border-t border-violet-100">
          <TrendingUp className="w-3.5 h-3.5" />
          {data.stats.conversion_rate_pct}% of interested students converted to paid registrations
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { api } from "../api/client";
import FestCard from "../components/FestCard";
import CategoryPills from "../components/CategoryPills";

export default function Home() {
  const [fests, setFests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All Fests");
  const [search, setSearch] = useState("");
  const resultsRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All Fests") params.category = category;
    if (search.trim()) params.search = search.trim();

    api
      .get("/fests", { params })
      .then((res) => setFests(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, search]);

  const [featured, ...rest] = useMemo(
    () => [...fests].sort((a, b) => b.interested_count - a.interested_count),
    [fests]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-brand-purple via-brand-violet to-brand-blue overflow-hidden">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute left-1/3 -bottom-32 w-80 h-80 rounded-full bg-white/5" />

        <div className="relative max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="w-3.5 h-3.5" /> AI-powered insights for every fest
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">
            Discover College Fests <br className="hidden md:block" />
            <span className="text-amber-300">Near You</span>
          </h1>
          <p className="text-white/80 max-w-lg mx-auto mb-8">
            From Techfest to Riviera — find every major college fest, register in a tap,
            and never miss out again.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.target.querySelector("input").blur(); // dismiss mobile keyboard
              resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="max-w-xl mx-auto flex items-center gap-1 sm:gap-2 bg-white rounded-full p-1.5 shadow-lg"
          >
            <Search className="w-5 h-5 text-gray-400 ml-2 sm:ml-3 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search fests, colleges…"
              className="flex-1 min-w-0 outline-none text-sm py-2"
            />
            <button
              type="submit"
              className="whitespace-nowrap bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full flex-shrink-0 transition-colors"
            >
              Find Fests
            </button>
          </form>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative">
        <div className="bg-white rounded-2xl shadow-md p-4 mb-8">
          <CategoryPills active={category} onChange={setCategory} />
        </div>

        <div ref={resultsRef} className="flex items-center justify-between mb-4 scroll-mt-6">
          <h2 className="font-display text-xl font-bold text-brand-ink">
            {category === "All Fests" ? "Trending Fests" : category}
          </h2>
          <span className="text-sm text-gray-400">
            {fests.length} fest{fests.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {loading && (
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        {!loading && fests.length === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            No fests match yet — check back soon, or try a different category.
          </div>
        )}

        {!loading && featured && (
          <div className="mb-6">
            <FestCard fest={featured} size="featured" />
          </div>
        )}

        {!loading && rest.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-16">
            {rest.map((fest) => (
              <FestCard key={fest.id} fest={fest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

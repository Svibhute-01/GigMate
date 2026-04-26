import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Gig, User } from "../lib/api";

export default function Gigs() {
  const [params, setParams] = useSearchParams();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const q = params.get("q") || "";
  const category = params.get("category") || "";
  const minPrice = params.get("minPrice") || "";
  const maxPrice = params.get("maxPrice") || "";

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get<{ gigs: Gig[] }>("/gigs", { params: { q, category, minPrice, maxPrice } })
      .then((r) => setGigs(r.data.gigs))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load gigs"))
      .finally(() => setLoading(false));
  }, [q, category, minPrice, maxPrice]);

  function update(key: string, val: string) {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val);
    else next.delete(key);
    setParams(next);
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-white text-3xl font-semibold">Browse gigs</h1>
          <p className="text-gray-400">{gigs.length} active gigs</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full md:w-auto">
          <input
            placeholder="Search"
            value={q}
            onChange={(e) => update("q", e.target.value)}
            className="px-3 py-2 rounded-md bg-[#062a23] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
          />
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => update("category", e.target.value)}
            className="px-3 py-2 rounded-md bg-[#062a23] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
          />
          <input
            placeholder="Min ₹"
            value={minPrice}
            onChange={(e) => update("minPrice", e.target.value)}
            className="px-3 py-2 rounded-md bg-[#062a23] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
          />
          <input
            placeholder="Max ₹"
            value={maxPrice}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="px-3 py-2 rounded-md bg-[#062a23] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
          />
        </div>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {!loading && !error && gigs.length === 0 && (
        <p className="text-gray-400">No gigs match your filters yet.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {gigs.map((g) => (
          <GigCard key={g._id} gig={g} />
        ))}
      </div>
    </div>
  );
}

function GigCard({ gig }: { gig: Gig }) {
  const student = typeof gig.student === "object" ? (gig.student as User) : null;
  return (
    <Link
      to={`/gigs/${gig._id}`}
      className="rounded-xl border border-[#0f3d34] bg-[#062a23] p-5 hover:border-[#18c29c] transition flex flex-col"
    >
      <span className="text-xs text-[#18c29c] uppercase tracking-wide">{gig.category}</span>
      <h3 className="text-white font-semibold mt-1 line-clamp-2">{gig.title}</h3>
      <p className="text-gray-400 text-sm mt-2 line-clamp-3 flex-1">{gig.description}</p>

      <div className="mt-4 flex flex-wrap gap-1">
        {gig.skills.slice(0, 3).map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-[#0f3d34] text-gray-300">
            {s}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#0f3d34] pt-3">
        <span className="text-xs text-gray-400">
          {student ? `by ${student.name}` : ""}
        </span>
        <span className="text-white font-semibold">₹{gig.price}</span>
      </div>
    </Link>
  );
}

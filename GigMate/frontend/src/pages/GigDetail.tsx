import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Gig, User } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function GigDetail() {
  const { id } = useParams<{ id: string }>();
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requirements, setRequirements] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [orderMsg, setOrderMsg] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get<{ gig: Gig }>(`/gigs/${id}`)
      .then((r) => setGig(r.data.gig))
      .catch((e) => setError(e?.response?.data?.message || "Failed to load gig"))
      .finally(() => setLoading(false));
  }, [id]);

  async function placeOrder() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "client") {
      setOrderMsg("Only clients can place orders.");
      return;
    }
    setOrdering(true);
    setOrderMsg(null);
    try {
      await api.post("/orders", { gigId: id, requirements });
      setOrderMsg("Order placed! Redirecting to your orders…");
      setTimeout(() => navigate("/orders"), 800);
    } catch (e: any) {
      setOrderMsg(e?.response?.data?.message || "Failed to place order");
    } finally {
      setOrdering(false);
    }
  }

  if (loading) return <p className="max-w-7xl mx-auto px-6 py-10 text-gray-400">Loading...</p>;
  if (error || !gig)
    return <p className="max-w-7xl mx-auto px-6 py-10 text-red-400">{error || "Not found"}</p>;

  const student = typeof gig.student === "object" ? (gig.student as User) : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <span className="text-xs text-[#18c29c] uppercase tracking-wide">{gig.category}</span>
        <h1 className="text-white text-3xl font-semibold mt-2">{gig.title}</h1>

        {student && (
          <Link
            to={`/users/${student._id}`}
            className="mt-3 inline-flex items-center gap-2 text-gray-300 hover:text-white"
          >
            <div className="w-8 h-8 rounded-full bg-[#18c29c] text-black font-bold flex items-center justify-center">
              {student.name[0]?.toUpperCase()}
            </div>
            <span>{student.name}</span>
          </Link>
        )}

        <div className="mt-8 rounded-xl border border-[#0f3d34] bg-[#062a23] p-6">
          <h2 className="text-white font-semibold mb-2">About this gig</h2>
          <p className="text-gray-300 whitespace-pre-line">{gig.description}</p>

          {gig.skills.length > 0 && (
            <>
              <h3 className="text-white font-medium mt-6 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {gig.skills.map((s) => (
                  <span key={s} className="text-xs px-2 py-1 rounded-full border border-[#0f3d34] text-gray-300">
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <aside className="rounded-xl border border-[#0f3d34] bg-[#062a23] p-6 h-fit sticky top-24">
        <div className="flex items-baseline justify-between">
          <span className="text-gray-400 text-sm">Starting at</span>
          <span className="text-white text-2xl font-bold">₹{gig.price}</span>
        </div>
        <p className="text-gray-400 text-sm mt-1">Delivery in {gig.deliveryDays} days</p>

        <textarea
          rows={4}
          placeholder="Tell the freelancer what you need..."
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="mt-4 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
        />

        <button
          onClick={placeOrder}
          disabled={ordering}
          className="mt-3 w-full py-2.5 rounded-xl bg-[#18c29c] text-black font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {ordering ? "Placing..." : "Place Order"}
        </button>

        {orderMsg && <p className="mt-3 text-sm text-gray-300">{orderMsg}</p>}
      </aside>
    </div>
  );
}

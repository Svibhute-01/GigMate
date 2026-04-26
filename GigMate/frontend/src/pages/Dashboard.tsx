import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Gig, Order } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  if (!user) return null;
  return user.role === "student" ? <StudentDashboard /> : <ClientDashboard />;
}

function StudentDashboard() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [g, o] = await Promise.all([
      api.get<{ gigs: Gig[] }>("/gigs/mine/list"),
      api.get<{ orders: Order[] }>("/orders"),
    ]);
    setGigs(g.data.gigs);
    setOrders(o.data.orders);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this gig?")) return;
    await api.delete(`/gigs/${id}`);
    load();
  }

  const earnings = orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-white text-3xl font-semibold">Freelancer Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Stat label="Active gigs" value={gigs.filter((g) => g.isActive).length} />
        <Stat label="Active orders" value={orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length} />
        <Stat label="Total earnings" value={`₹${earnings}`} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">My gigs</h2>
        <Link
          to="/gigs/new"
          className="px-4 py-2 rounded-md bg-[#18c29c] text-black font-semibold hover:opacity-90 text-sm"
        >
          + New gig
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400 mt-4">Loading...</p>
      ) : gigs.length === 0 ? (
        <p className="text-gray-400 mt-4">You haven't created any gigs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {gigs.map((g) => (
            <div key={g._id} className="rounded-xl border border-[#0f3d34] bg-[#062a23] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs text-[#18c29c] uppercase">{g.category}</span>
                  <h3 className="text-white font-semibold">{g.title}</h3>
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{g.description}</p>
                </div>
                <span className="text-white font-semibold whitespace-nowrap">₹{g.price}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  to={`/gigs/${g._id}`}
                  className="text-xs px-3 py-1 rounded-md border border-[#0f3d34] text-gray-200 hover:bg-[#0f3d34]"
                >
                  View
                </Link>
                <Link
                  to={`/gigs/${g._id}/edit`}
                  className="text-xs px-3 py-1 rounded-md border border-[#0f3d34] text-gray-200 hover:bg-[#0f3d34]"
                >
                  Edit
                </Link>
                <button
                  onClick={() => remove(g._id)}
                  className="text-xs px-3 py-1 rounded-md border border-red-900 text-red-300 hover:bg-red-900/30"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ClientDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ orders: Order[] }>("/orders")
      .then((r) => setOrders(r.data.orders))
      .finally(() => setLoading(false));
  }, []);

  const spent = orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.price, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-white text-3xl font-semibold">Client Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Stat label="Total orders" value={orders.length} />
        <Stat label="In progress" value={orders.filter((o) => o.status === "in-progress").length} />
        <Stat label="Total spent" value={`₹${spent}`} />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-white text-xl font-semibold">Recent orders</h2>
        <Link
          to="/gigs"
          className="px-4 py-2 rounded-md bg-[#18c29c] text-black font-semibold hover:opacity-90 text-sm"
        >
          Browse gigs
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400 mt-4">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 mt-4">You haven't placed any orders yet.</p>
      ) : (
        <div className="mt-4 rounded-xl border border-[#0f3d34] overflow-hidden">
          {orders.slice(0, 6).map((o) => (
            <div
              key={o._id}
              className="flex items-center justify-between px-5 py-4 border-b border-[#0f3d34] last:border-b-0 bg-[#062a23]"
            >
              <div>
                <p className="text-white">{o.gig?.title || "Gig"}</p>
                <p className="text-xs text-gray-400">with {o.student?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={o.status} />
                <span className="text-white">₹{o.price}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-[#0f3d34] bg-[#062a23] p-5">
      <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="text-white text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: Order["status"] }) {
  const map: Record<Order["status"], string> = {
    pending: "bg-yellow-900/40 text-yellow-300 border-yellow-800",
    "in-progress": "bg-blue-900/40 text-blue-300 border-blue-800",
    completed: "bg-emerald-900/40 text-emerald-300 border-emerald-800",
    cancelled: "bg-red-900/40 text-red-300 border-red-800",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${map[status]}`}>{status}</span>
  );
}

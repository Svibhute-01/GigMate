import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { Order } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { StatusBadge } from "./Dashboard";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const r = await api.get<{ orders: Order[] }>("/orders");
    setOrders(r.data.orders);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: Order["status"]) {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      load();
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to update");
    }
  }

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-white text-3xl font-semibold mb-6">My orders</h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div
              key={o._id}
              className="rounded-xl border border-[#0f3d34] bg-[#062a23] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold">{o.gig?.title || "Gig"}</h3>
                  <StatusBadge status={o.status} />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {user.role === "client"
                    ? `Freelancer: ${o.student?.name}`
                    : `Client: ${o.client?.name}`}
                </p>
                {o.requirements && (
                  <p className="text-sm text-gray-300 mt-2 line-clamp-2">{o.requirements}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">₹{o.price}</span>
                {user.role === "student" && o.status === "pending" && (
                  <button
                    onClick={() => setStatus(o._id, "in-progress")}
                    className="text-xs px-3 py-1.5 rounded-md bg-blue-900/40 text-blue-200 border border-blue-800 hover:bg-blue-900/60"
                  >
                    Start work
                  </button>
                )}
                {user.role === "student" && o.status === "in-progress" && (
                  <button
                    onClick={() => setStatus(o._id, "completed")}
                    className="text-xs px-3 py-1.5 rounded-md bg-emerald-900/40 text-emerald-200 border border-emerald-800 hover:bg-emerald-900/60"
                  >
                    Mark complete
                  </button>
                )}
                {user.role === "client" && o.status === "pending" && (
                  <button
                    onClick={() => setStatus(o._id, "cancelled")}
                    className="text-xs px-3 py-1.5 rounded-md bg-red-900/40 text-red-200 border border-red-800 hover:bg-red-900/60"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

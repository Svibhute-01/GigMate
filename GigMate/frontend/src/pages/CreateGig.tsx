import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../lib/api";
import type { Gig } from "../lib/api";

const categories = ["Web Development", "Design", "Writing", "Video", "AI & ML", "Mobile Apps", "Other"];

export default function CreateGig() {
  const { id } = useParams<{ id?: string }>();
  const editing = Boolean(id);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: categories[0],
    price: 500,
    deliveryDays: 3,
    skills: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api.get<{ gig: Gig }>(`/gigs/${id}`).then((r) => {
      const g = r.data.gig;
      setForm({
        title: g.title,
        description: g.description,
        category: g.category,
        price: g.price,
        deliveryDays: g.deliveryDays,
        skills: g.skills.join(", "),
      });
    });
  }, [id]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        deliveryDays: Number(form.deliveryDays),
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      if (editing) {
        await api.put(`/gigs/${id}`, payload);
      } else {
        await api.post("/gigs", payload);
      }
      navigate("/dashboard");
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-white text-3xl font-semibold mb-6">
        {editing ? "Edit gig" : "Create a new gig"}
      </h1>

      <form onSubmit={submit} className="space-y-4 rounded-2xl border border-[#0f3d34] bg-[#062a23] p-6">
        <Field label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <label className="block">
          <span className="text-xs text-gray-400">Description</span>
          <textarea
            rows={5}
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
          />
        </label>
        <label className="block">
          <span className="text-xs text-gray-400">Category</span>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Price (₹)"
            type="number"
            value={String(form.price)}
            onChange={(v) => setForm({ ...form, price: Number(v) })}
            required
          />
          <Field
            label="Delivery (days)"
            type="number"
            value={String(form.deliveryDays)}
            onChange={(v) => setForm({ ...form, deliveryDays: Number(v) })}
            required
          />
        </div>
        <Field
          label="Skills (comma separated)"
          value={form.skills}
          onChange={(v) => setForm({ ...form, skills: v })}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-xl border border-[#0f3d34] text-gray-200 hover:bg-[#0f3d34]"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-[#18c29c] text-black font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Saving..." : editing ? "Update gig" : "Create gig"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-400">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
      />
    </label>
  );
}

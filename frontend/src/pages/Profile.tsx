import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Profile() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    name: "",
    college: "",
    bio: "",
    skills: "",
    portfolioLinks: "",
    companyName: "",
    description: "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      name: user.name,
      college: user.studentProfile?.college || "",
      bio: user.studentProfile?.bio || "",
      skills: user.studentProfile?.skills?.join(", ") || "",
      portfolioLinks: user.studentProfile?.portfolioLinks?.join(", ") || "",
      companyName: user.clientProfile?.companyName || "",
      description: user.clientProfile?.description || "",
    });
  }, [user]);

  if (!user) return null;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload: any = { name: form.name };
      if (user!.role === "student") {
        payload.college = form.college;
        payload.bio = form.bio;
        payload.skills = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
        payload.portfolioLinks = form.portfolioLinks.split(",").map((s) => s.trim()).filter(Boolean);
      } else {
        payload.companyName = form.companyName;
        payload.description = form.description;
      }
      await api.put("/users/me", payload);
      await refresh();
      setMsg("Profile updated.");
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-white text-3xl font-semibold mb-2">My profile</h1>
      <p className="text-gray-400 mb-6">Signed in as <span className="text-[#18c29c]">{user.email}</span> ({user.role})</p>

      <form onSubmit={save} className="space-y-4 rounded-2xl border border-[#0f3d34] bg-[#062a23] p-6">
        <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />

        {user.role === "student" ? (
          <>
            <Field label="College" value={form.college} onChange={(v) => setForm({ ...form, college: v })} />
            <Field label="Skills (comma separated)" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} />
            <Field label="Portfolio links (comma separated)" value={form.portfolioLinks} onChange={(v) => setForm({ ...form, portfolioLinks: v })} />
            <label className="block">
              <span className="text-xs text-gray-400">Bio</span>
              <textarea
                rows={4}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
              />
            </label>
          </>
        ) : (
          <>
            <Field label="Company name" value={form.companyName} onChange={(v) => setForm({ ...form, companyName: v })} />
            <label className="block">
              <span className="text-xs text-gray-400">Description</span>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
              />
            </label>
          </>
        )}

        {msg && <p className="text-sm text-gray-300">{msg}</p>}

        <button
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-[#18c29c] text-black font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs text-gray-400">{label}</span>
      <input
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
      />
    </label>
  );
}

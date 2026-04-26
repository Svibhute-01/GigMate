import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { SignupPayload } from "../context/AuthContext";

type Step = "role" | "details";

export default function SignupModal() {
  const [step, setStep] = useState<Step>("role");
  const [role, setRole] = useState<"student" | "client">("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function update<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: SignupPayload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role,
      };
      await signup(payload);
      // No auto-login. Send the user to the login page with a friendly message
      // and prefill their email.
      navigate("/login", {
        replace: true,
        state: {
          notice: "Account created successfully. Please sign in to continue.",
          email: form.email,
        },
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#021b16]/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-[520px] rounded-2xl border border-[#0f3d34] bg-gradient-to-b from-[#062a23] to-[#031c17] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#18c29c] rounded-md flex items-center justify-center text-black font-bold">g</div>
            <h1 className="text-white font-semibold text-lg">GigMate</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="w-full h-[3px] bg-[#0f3d34] rounded-full mb-6">
          <div
            className="h-full bg-[#18c29c] rounded-full transition-all"
            style={{ width: step === "role" ? "50%" : "100%" }}
          />
        </div>

        {step === "role" ? (
          <>
            <h2 className="text-white text-2xl font-semibold mb-2">Join GigMate as a...</h2>
            <p className="text-gray-400 text-sm mb-6">Pick your role to get a tailored experience.</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <RoleCard
                active={role === "student"}
                onClick={() => setRole("student")}
                icon="🎓"
                title="Student Freelancer"
                desc="I want to offer services and earn money"
                bullets={["Post unlimited gigs", "Build your portfolio", "Get paid via UPI"]}
              />
              <RoleCard
                active={role === "client"}
                onClick={() => setRole("client")}
                icon="💼"
                title="Business / Client"
                desc="I want to hire students for tasks"
                bullets={["Post tasks for free", "Access verified students", "Fast delivery"]}
              />
            </div>

            <button
              onClick={() => setStep("details")}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#18c29c] to-[#0ea37f] text-black font-semibold hover:opacity-90"
            >
              Continue as {role === "student" ? "Student Freelancer" : "Client"} →
            </button>

            <p className="text-center text-xs text-gray-400 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-[#18c29c] cursor-pointer hover:underline"
              >
                Log in
              </span>
            </p>
          </>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <h2 className="text-white text-xl font-semibold mb-1">Create your account</h2>
            <p className="text-gray-400 text-xs mb-2">
              As {role === "student" ? "Student Freelancer" : "Client"}. You'll set up your
              profile after you sign in.
            </p>

            <Field label="Full name" value={form.name} onChange={(v) => update("name", v)} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
            <Field label="Password (min 6)" type="password" value={form.password} onChange={(v) => update("password", v)} required />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep("role")}
                className="flex-1 py-2.5 rounded-xl border border-[#0f3d34] text-gray-200 hover:bg-[#0f3d34]"
              >
                Back
              </button>
              <button
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-[#18c29c] text-black font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Creating..." : "Create account"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function RoleCard({
  active,
  onClick,
  icon,
  title,
  desc,
  bullets,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  desc: string;
  bullets: string[];
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-4 border transition-all ${
        active ? "border-[#18c29c] shadow-[0_0_12px_#18c29c40]" : "border-[#0f3d34]"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-2xl">{icon}</span>
        {active && (
          <span className="bg-[#18c29c] text-black text-xs px-2 py-0.5 rounded-full">✓</span>
        )}
      </div>
      <h3 className="text-white font-medium text-sm">{title}</h3>
      <p className="text-gray-400 text-xs mb-2">{desc}</p>
      <ul className="text-xs text-gray-300 space-y-1">
        {bullets.map((b) => (
          <li key={b}>✦ {b}</li>
        ))}
      </ul>
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

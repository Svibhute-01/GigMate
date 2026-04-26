import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-[#0f3d34] bg-gradient-to-b from-[#062a23] to-[#031c17] p-8 shadow-xl"
      >
        <h1 className="text-white text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-gray-400 text-sm mb-6">Sign in to your GigMate account.</p>

        <label className="block mb-3">
          <span className="text-xs text-gray-400">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
          />
        </label>

        <label className="block mb-4">
          <span className="text-xs text-gray-400">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded-md bg-[#031c17] border border-[#0f3d34] text-white outline-none focus:border-[#18c29c]"
          />
        </label>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-[#18c29c] text-black font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-5">
          New to GigMate?{" "}
          <Link to="/signup" className="text-[#18c29c] hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

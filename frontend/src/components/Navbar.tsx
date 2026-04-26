import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="sticky top-0 z-30 bg-[#021b16]/90 backdrop-blur border-b border-[#0f3d34]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#18c29c] rounded-md flex items-center justify-center text-black font-bold">
            g
          </div>
          <span className="text-white font-semibold text-lg">GigMate</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link to="/gigs" className="hover:text-white">Browse Gigs</Link>
          {user?.role === "student" && (
            <>
              <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
              <Link to="/gigs/new" className="hover:text-white">Create Gig</Link>
            </>
          )}
          {user?.role === "client" && (
            <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
          )}
          {user && <Link to="/orders" className="hover:text-white">Orders</Link>}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/profile"
                className="hidden sm:block text-sm text-gray-300 hover:text-white"
              >
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm rounded-md border border-[#0f3d34] text-gray-200 hover:bg-[#0f3d34]"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-300 hover:text-white">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 text-sm rounded-md bg-[#18c29c] text-black font-semibold hover:opacity-90"
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

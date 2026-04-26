import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { dashboardPathFor } from "./lib/api";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SignupModal from "./components/SignUp";
import RequireAuth from "./components/RequireAuth";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Gigs from "./pages/Gigs";
import GigDetail from "./pages/GigDetail";
import CreateGig from "./pages/CreateGig";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import StudentProfileSetup from "./pages/StudentProfileSetup";
import ClientProfileSetup from "./pages/ClientProfileSetup";

function DashboardRedirect() {
  const { user, loading } = useAuth();
  if (loading) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-gray-400">Loading...</p>;
  }
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={dashboardPathFor(user.role)} replace />;
}

function AppRoutes() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | null;

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh]">
        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupModal />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/gigs/new" element={<RequireAuth role="student"><CreateGig /></RequireAuth>} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route path="/gigs/:id/edit" element={<RequireAuth role="student"><CreateGig /></RequireAuth>} />

          {/* Profile setup pages — accessible without a complete profile */}
          <Route
            path="/student/profile-setup"
            element={
              <RequireAuth role="student" allowIncompleteProfile>
                <StudentProfileSetup />
              </RequireAuth>
            }
          />
          <Route
            path="/client/profile-setup"
            element={
              <RequireAuth role="client" allowIncompleteProfile>
                <ClientProfileSetup />
              </RequireAuth>
            }
          />

          {/* Role-specific dashboards */}
          <Route
            path="/student/dashboard"
            element={<RequireAuth role="student"><Dashboard /></RequireAuth>}
          />
          <Route
            path="/client/dashboard"
            element={<RequireAuth role="client"><Dashboard /></RequireAuth>}
          />
          {/* Generic /dashboard redirect by role for back-compat */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/users/:id" element={<UserProfile />} />
          <Route path="*" element={<div className="max-w-7xl mx-auto px-6 py-20 text-gray-400">Page not found</div>} />
        </Routes>

        {state?.backgroundLocation && (
          <Routes>
            <Route path="/signup" element={<SignupModal />} />
          </Routes>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

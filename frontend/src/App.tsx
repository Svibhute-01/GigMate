import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import type { Location } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
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
          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
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

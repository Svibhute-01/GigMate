import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardPathFor, profileSetupPathFor } from "../lib/api";

export default function RequireAuth({
  children,
  role,
  allowIncompleteProfile = false,
}: {
  children: ReactNode;
  role?: "student" | "client";
  /**
   * Set to true on profile-setup pages so we don't redirect into a loop
   * for users who haven't finished onboarding yet.
   */
  allowIncompleteProfile?: boolean;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="max-w-7xl mx-auto px-6 py-10 text-gray-400">Loading...</p>;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={dashboardPathFor(user.role)} replace />;
  }
  if (!user.isProfileComplete && !allowIncompleteProfile) {
    return <Navigate to={profileSetupPathFor(user.role)} replace />;
  }
  return <>{children}</>;
}

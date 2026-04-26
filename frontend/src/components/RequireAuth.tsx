import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({
  children,
  role,
}: {
  children: ReactNode;
  role?: "student" | "client";
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
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

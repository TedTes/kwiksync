import React from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store";
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUserStore();
  const isAuthenticated = !!user;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

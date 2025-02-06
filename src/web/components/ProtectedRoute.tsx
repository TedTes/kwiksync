import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store";
interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useUserStore();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

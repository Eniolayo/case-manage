import type React from "react";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login");
    }
  }, [navigate, location.pathname]);

  return <>{children}</>;
}

import React from "react";
import { useAuth } from "../contexts/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "./routes";
import LoadingScreen from "../components/LoadingScreen";

function AuthRequire({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  console.log(isAuthenticated);
  const location = useLocation();
  if (!isInitialized) {
    return <LoadingScreen />;
  }

  // if (!isAuthenticated) {
  //   console.log("check");
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return children;
}

export default AuthRequire;

import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuthStore();
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  return <>{children}</>;
};

export default ProtectedRoute;

import { Navigate } from "react-router";
import useAuthStore from "../stores/useAuthStore";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuthStore();
  if (isLoading) return <div>Loading...</div>;
  if (!isLoggedIn) return <Navigate to="/login" />;
  return children;
}

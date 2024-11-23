import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const RedirectIfAdmin = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();

  // If the user is authenticated and has the "admin" role, redirect to the admin dashboard
  if (isAuthenticated && user?.role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
};

export default RedirectIfAdmin;

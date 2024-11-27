
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const RedirectIfAuthenticated = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
  
    if (isAuthenticated) {
      // Redirect based on the user's role
      if (user?.role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  
    return children;
  };

export default RedirectIfAuthenticated;

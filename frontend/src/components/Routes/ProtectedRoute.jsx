
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated } = useAuthStore();
  
    // Check if the user is not authenticated
    if (!isAuthenticated) {
      return <Navigate to="/signup" replace />;
    }
  
    // Check if the user's role is not admin
    if (user?.role !== "admin") {
      return <Navigate to="/" replace />;
    }
  
    return children;
  };

export default ProtectedRoute;

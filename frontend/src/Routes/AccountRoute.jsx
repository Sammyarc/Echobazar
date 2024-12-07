import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import UserDashboard from "../pages/UserDashboard";


const AccountRoute = () => {
    const { isAuthenticated } = useAuthStore();
    const location = useLocation();
  
    if (!isAuthenticated) {
      return <Navigate to="/signup" state={{ from: location.pathname }} replace />;
    }
  
    return <UserDashboard />;
}

export default AccountRoute
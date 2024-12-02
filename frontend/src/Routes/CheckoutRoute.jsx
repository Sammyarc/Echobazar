import { Navigate, useLocation } from 'react-router-dom';
import Checkout from "../pages/Checkout";
import { useAuthStore } from '../store/authStore';

const CheckoutRoute = () => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signup" state={{ from: location.pathname }} replace />;
  }

  return <Checkout />;
};

export default CheckoutRoute;

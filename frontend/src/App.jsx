import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import { useAuthStore } from "./store/authStore";
import LoadingSpinner from "./components/Spinner/LoadingSpinner";
import Forgotpassword from "./pages/Forgotpassword";
import Resetpassword from "./pages/Resetpassword";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from "./pages/AdminDashboard";
import ProductsLists from "./pages/ProductsLists";
import ProductDetail from "./pages/ProductDetail";

// Protected Route Component
const ProtectedRoute = ({ element, roles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    // Redirect to signup page if not authenticated
    return <Navigate to="/signup" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect if the user does not have the required role
    return <Navigate to="/" />;
  }

  return element;
};

const App = () => {
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<Resetpassword />} />
        <Route path="/shop" element={<ProductsLists />} />
        <Route path="/product/:name" element={<ProductDetail />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute element={<AdminDashboard />} roles={['admin']} />
          }
        />
      </Routes>
      <ToastContainer
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        theme="light"
      />
    </Router>
  );
};

export default App;

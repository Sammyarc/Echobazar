import {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Home from './pages/Home'
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import {useAuthStore} from "./store/authStore";
import LoadingSpinner from "./components/Spinner/LoadingSpinner";
import Forgotpassword from "./pages/Forgotpassword";
import Resetpassword from "./pages/Resetpassword";
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles
import AdminDashboard from "./pages/AdminDashboard";
import ProductsLists from "./pages/ProductsLists";
import ProductDetail from "./pages/ProductDetail";


// protect routes that require authentication
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, user } = useAuthStore();
  
    // Redirect unauthenticated users to the signup page
    if (!isAuthenticated) {
      return <Navigate to="/signup" replace />;
    }
  
    // Redirect users without verified email to the verify-email page
    if (!user?.isVerified) {
      return <Navigate to="/verify-email" replace />;
    }
  
    // Restrict access based on roles
    if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
      // Redirect to a role-specific page or fallback to home
      return <Navigate to="/" replace />;
    }
  
    return children;
  };

// redirect authenticated users
const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();
  
    if (isAuthenticated && user?.isVerified) {
      // Redirect based on user roles
      if (user.role === "admin") {
        return <Navigate to="/admin-dashboard" replace />;
      }
      if (user.role === "user") {
        return <Navigate to="/" replace />;
      }
      // Add other role-based redirects if needed
    }
  
    return children;
  };


const App = () => {
    const {isCheckingAuth, checkAuth} = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) 
        return <LoadingSpinner/>;
    
    return (

        <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <Signup />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectAuthenticatedUser>
              <VerifyEmail />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<Resetpassword />} />
        <Route path="/shop" element={<ProductsLists />} />
        <Route path="/product/:name" element={<ProductDetail />} />

        {/* Protected Admin Route */}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
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


export default App
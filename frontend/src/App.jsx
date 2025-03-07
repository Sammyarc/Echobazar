import { Analytics } from "@vercel/analytics/react"
import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
import RedirectIfAuthenticated from "../src/Routes/RedirectIfAuthenticated";
import ProtectedRoute from "../src/Routes/ProtectedRoute";
import RedirectIfAdmin from "../src/Routes/RedirectIfAdmin";
import Cart from "./pages/Cart";
import FaQ from "./pages/FaQ";
import ErrorPage from "./pages/ErrorPage";
import Contact from "./pages/Contact";
import Checkout from "./pages/Checkout";
import CheckoutRoute from "../src/Routes/CheckoutRoute";
import OrderConfirmation from "./pages/OrderConfirmation";
import UserDashboard from "./pages/UserDashboard";
import useWishlistStore from "./store/useWishlistStore";
import AccountRoute from "./Routes/AccountRoute";



const App = () => {
  const { isCheckingAuth, isAuthenticated, checkAuth } = useAuthStore();
  const { initializeWishlist } = useWishlistStore();
  
  useEffect(() => {
    const initialize = async () => {
      await checkAuth(); // Check if the user is authenticated
      if (isAuthenticated) {
        initializeWishlist(); // Initialize the wishlist only if authenticated
      }
    };
  
    initialize();
  }, [checkAuth, isAuthenticated, initializeWishlist]);
  

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <Router>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={ <RedirectIfAdmin>
      <Home />
    </RedirectIfAdmin>} />
      
      <Route
        path="/signup"
        element={
          <RedirectIfAuthenticated>
            <Signup />
          </RedirectIfAuthenticated>
        }
      />
      
      <Route
        path="/verify-email"
        element={
          <RedirectIfAuthenticated>
            <VerifyEmail />
          </RedirectIfAuthenticated>
        }
      />
      
      <Route
        path="/forgot-password"
        element={
          <RedirectIfAuthenticated>
            <Forgotpassword />
          </RedirectIfAuthenticated>
        }
      />
      
      <Route
        path="/reset-password/:token"
        element={
          <RedirectIfAuthenticated>
            <Resetpassword />
          </RedirectIfAuthenticated>
        }
      />

      <Route path="/shop" element={<ProductsLists />} />
      <Route path="/product/:name" element={<ProductDetail />} />
      <Route path="/faqs" element={<FaQ />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/order-confirmation" element={<OrderConfirmation />} />
      <Route path="/checkout" element={
        <CheckoutRoute>
          <Checkout />
        </CheckoutRoute>
        } />

        <Route path="/my-account/*" element={<AccountRoute><UserDashboard /></AccountRoute>} />
      <Route
        path="/reset-password/:token"
        element={
          <RedirectIfAuthenticated>
            <Resetpassword />
          </RedirectIfAuthenticated>
        }
      />

      {/* Protected Admin Route */}
      <Route
        path="/admin-dashboard/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Error Pages */}
      <Route path="*" element={<ErrorPage />} />
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

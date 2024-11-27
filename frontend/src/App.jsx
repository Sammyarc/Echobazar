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

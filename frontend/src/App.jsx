import {useEffect} from "react";
import {BrowserRouter as Router, Route, Routes, Navigate} from "react-router-dom";
import Home from './pages/Home'
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import {useAuthStore} from "./store/authStore";
import {Toaster} from 'react-hot-toast';
import LoadingSpinner from "./components/Spinner/LoadingSpinner";
import Forgotpassword from "./pages/Forgotpassword";
import Resetpassword from "./pages/Resetpassword";



// protect routes that require authentication
/*const ProtectedRoute = ({children}) => {
    const {isAuthenticated, user} = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to='/signup' replace="replace"/>;
    }

    if (!user.isVerified) {
        return <Navigate to='/verify-email' replace="replace"/>;
    }

    return children;
};*/

// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({children}) => {
    const {isAuthenticated, user} = useAuthStore();

    if (isAuthenticated && user.isVerified) {
        return <Navigate to='/' replace="replace"/>;
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
                <Route path="/" element={
                    <Home />}/>
                <Route
                    path="/signup"
                    element={<RedirectAuthenticatedUser > <Signup /> </RedirectAuthenticatedUser>
                    }
                />
                <Route path="/verify-email" element={<VerifyEmail />}/>

                <Route
                    path="/forgot-password"
                    element={<RedirectAuthenticatedUser> < Forgotpassword /> </RedirectAuthenticatedUser>
                    }
                />

                <Route
                    path="/reset-password/:token"
                    element={<RedirectAuthenticatedUser> < Resetpassword /> </RedirectAuthenticatedUser>
                    }
                /> {/* catch all routes */}
                <Route path='*' element={<Navigate to = '/' replace />}/>
            </Routes>
            <Toaster/>
        </Router>
    )
}

export default App
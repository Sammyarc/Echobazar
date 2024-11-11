import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import PasswordStrengthMeter from "../PasswordStrengthMeter/PasswordStregthMeter";
import {PiUserLight} from "react-icons/pi";
import {GoMail} from "react-icons/go";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {MdErrorOutline} from "react-icons/md";
import {LuLoader2} from "react-icons/lu";
import {useAuthStore} from "../../store/authStore";
import Role from '../Popups/Role';
import {toast} from 'react-toastify';

import axios from "axios";

// Set the API URL based on the environment
const API_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/auth"
    : "/api/auth";

axios.defaults.withCredentials = true;

const Signin = () => {
    const {
        signup,
        googleSignIn,
        login,
        error,
        isLoading,
        clearError
    } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const navigate = useNavigate();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [role, setRole] = useState('buyer'); // Default to buyer
    const [isRoleSelectionVisible, setIsRoleSelectionVisible] = useState(false);

//Function to extract the access token from the URL
const getTokenFromUrl = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    return hashParams.get("access_token");
};

// Function to initialize Google login process after Google redirects
const initGoogleSignIn = () => {
    const token = getTokenFromUrl();
    if (token) {
        handleGoogleLoginSuccess(token);
        // Clear both the hash and query parameters in the URL
        window.history.replaceState(null, '', window.location.pathname);
    }
};


// Initialize after Google redirect
window.onload = () => {
    initGoogleSignIn();
};

// Fetch user profile data from Google using the access token
const fetchGoogleUserProfile = async (token) => {
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error("Failed to fetch Google user profile");
    return await response.json();
};

// Check if the user exists in the database
const checkUserInDatabase = async (email) => {
    const response = await axios.get(`${API_URL}/google-check`, { params: { email } });
    if (response.status !== 200) throw new Error("User check failed");
    return response.data.user ? true : false;
};

// Main function to handle Google login
const handleGoogleLoginSuccess = async (token) => {
    try {
        // Fetch user profile directly using the access token
        const userProfile = await fetchGoogleUserProfile(token);
        const userEmail = userProfile.email;

        // Check if user exists in database
        const userExists = await checkUserInDatabase(userEmail);

        if (userExists) {
            await googleSignIn(token); // Sign in existing user
            navigate("/"); // Redirect to home
        } else {
            setIsRoleSelectionVisible(true); // Show role selection for new user
            localStorage.setItem("googleToken", token);
        }
    } catch (error) {
        console.error("Error during Google Sign-In:", error);
        toast.error("Failed to sign in. Please try again.");
    }
};



// Role selection handler for new users
const handleRoleSelection = async (selectedRole) => {
    const token = localStorage.getItem("googleToken");
    if (token) {
        await googleSignIn(token, selectedRole);
        localStorage.removeItem("googleToken");
        navigate("/"); // Redirect to home
    }
    setIsRoleSelectionVisible(false); // Hide role selection
};



    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    // Function to clear inputs
    const clearInputs = () => {
        setName('');
        setEmail('');
        setPassword('');
        setTermsAccepted(false);
        setRememberMe(false);
    };

    // Toggle between login and register
    const toggleMode = () => {
        clearError(); // Clear the error when switching modes
        clearInputs(); // Clear inputs when toggling mode
        setIsRegister(!isRegister);
    };

    // Toggle between forgotpassword and register
    const toggleForgotPasswordMode = () => {
        clearError(); // Clear the error when switching modes
        window.scrollTo(0, 0);
    };

    // Toggle Remember Me checkbox
    const handleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    const handleTermsAcceptance = (e) => {
        setTermsAccepted(e.target.checked);
    };

    // Register handler
    const handleRegister = async () => {
        try {
            await signup(email, password, name);
            navigate("/verify-email");
            window.scrollTo(0, 0);
        } catch (error) {
            console.log(error);
        }
    };

    // Login handler
    const handleLogin = async () => {
        try {
            await login(email, password);
            navigate("/");
            window.scrollTo(0, 0);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className='w-[90vw] md:w-[30vw] flex flex-col mx-auto my-[8vw] bg-White shadow-xl px-[2.5vw] py-[7vw] md:p-[2vw] rounded-[0.5vw]'>
            <h2
                className='text-center font-Poppins text-[7vw] md:text-[2.5vw] font-semibold text-Gray900 mb-[1vw]'>
                {
                    isRegister
                        ? 'Create Account'
                        : 'Welcome Back!'
                }
            </h2>

            {/* Name input only visible in register mode */}
            {
                isRegister && (
                    <div className="relative mt-[3vw] md:mt-[1vw]">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            className='w-full outline-none border border-Gray200 px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[9vw] md:pr-[3vw] focus:border-Primary'
                            onChange={(e) => setName(e.target.value)}/>
                        <div
                            className="absolute inset-y-0 right-[3vw] md:right-[1vw] flex items-center">
                            <PiUserLight className="fa fa-user text-Gray600 md:text-[1.3vw]"/>
                        </div>
                    </div>
                )
            }

            {/* Email input */}
            <div className="relative mt-[3vw] md:mt-[1vw]">
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="on"
                    value={email}
                    className='w-full outline-none border border-Gray200 px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[9vw] md:pr-[3vw] focus:border-Primary'
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmail(email.toLowerCase())}/>
                <div
                    className="absolute inset-y-0 right-[3vw] md:right-[1vw] flex items-center">
                    <GoMail className="text-Gray600 md:text-[1.3vw]"/>
                </div>
            </div>

            {/* Password input */}
            <div className="relative mt-[3vw] md:mt-[1vw]">
                <input
                    type={isPasswordVisible
                        ? 'text'
                        : 'password'}
                    placeholder="Password"
                    value={password}
                    className='w-full outline-none border border-Gray200 px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[9vw] md:pr-[3vw] focus:border-Primary'
                    onChange={(e) => setPassword(e.target.value)}/>
                <div
                    className="absolute inset-y-0 right-[3vw] md:right-[1vw] flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}>
                    {
                        isPasswordVisible
                            ? <FaEyeSlash className="text-Gray600 md:text-[1.3vw]"/>
                            : <FaEye className="text-Gray600 md:text-[1.3vw]"/>
                    }
                </div>
            </div>

            {/* Role selection for registration */}
            {
                isRegister && (
                    <div className="mt-[3vw] md:mt-[1vw] flex flex-col gap-1">
                        <label className="text-[4vw] md:text-[1vw] text-Gray700 font-Poppins">Select Your Role:</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-[30%] mt-[0.5vw] border border-Gray200 rounded-md p-1 font-Poppins text-Gray700 text-[4vw] md:text-[1vw] focus:border-Primary outline-none">
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                )
            }

            {
                isRoleSelectionVisible && (
                    <Role
                        onSelectRole={handleRoleSelection}
                        onClose={() => setIsRoleSelectionVisible(false)}/>
                )
            }

            {/* Show error only for the specific mode */}
            {
                error && <p
                        className='text-red-500 flex items-start gap-1 font-medium text-[4vw] md:text-[1vw] mt-2 font-Poppins'><MdErrorOutline className='text-[5vw] md:text-[1.2vw]'/> {error}</p>
            }

            {/* Password Strength Meter only in register mode */}
            {isRegister && <PasswordStrengthMeter password={password}/>}

            {/* Checkbox for "Remember Me" or "Terms Acceptance" */}
            <div className="flex justify-between items-center mt-[3vw] md:mt-[1vw]">
                {
                    isRegister
                        ? (
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={handleTermsAcceptance}
                                    className="h-[4.5vw] w-[4.5vw] md:h-[1vw] md:w-[1vw] rounded-[0.2vw] accent-Primary cursor-pointer"/>
                                <span className="text-[4vw] md:text-[1vw] text-Gray700 font-Poppins">I accept the Terms and Conditions</span>
                            </label>
                        )
                        : (
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={handleRememberMe}
                                    className="h-[4.5vw] w-[4.5vw] md:h-[1vw] md:w-[1vw] rounded-[0.2vw] accent-Primary cursor-pointer"/>
                                <span className="text-[4vw] md:text-[0.9vw] text-Gray700 font-Poppins">Remember Me</span>
                            </label>
                        )
                }

                {
                    !isRegister && (
                        <Link
                            to="/forgot-password"
                            onClick={toggleForgotPasswordMode}
                            className="text-[4vw] md:text-[0.9vw] text-Gray700 font-Poppins hover:underline">
                            Forgot Password?
                        </Link>
                    )
                }
            </div>

            {/* Submit button */}
            <button
                className={`mt-[4vw] md:mt-[1vw] ${isLoading || (isRegister && !termsAccepted)
                    ? 'bg-Gray500 cursor-not-allowed'
                    : 'bg-Primary hover:bg-HardPrimary'} text-White font-Poppins h-[11vw] md:h-[2.5vw] rounded-lg`}
                onClick={() => {
                    if (isRegister) {
                        handleRegister();
                    } else {
                        handleLogin();
                    }
                }}
                disabled={isLoading || (isRegister && !termsAccepted)}>
                {/* Disable if loading or terms are not accepted */}
                {
                    isLoading
                        ? (
                            <div className='flex justify-center items-center space-x-2'>
                                <LuLoader2 className="animate-spin w-6 h-6"/> {/* Spinner icon */}
                                <span>{
                                        isRegister
                                            ? 'Creating Account...'
                                            : 'Please Wait...'
                                    }</span>
                            </div>
                        )
                        : (
                            isRegister
                                ? 'Create Account'
                                : 'Login'
                        )
                }
            </button>

            <div className="flex flex-col mt-[4vw] md:mt-[1vw]">
                <div className="flex items-center mb-[4vw] md:mb-[1vw]">
                    <div className="flex-1 border-t border-Gray300 mr-2"></div>
                    <span className='text-Gray700 text-[3.5vw] md:text-[1vw] font-Poppins'>OR</span>
                    <div className="flex-1 border-t border-Gray300 ml-2"></div>
                </div>
            {/* Sign in with Google button */}
            <button
                    onClick={() => {
                        window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location)}&response_type=token&scope=profile email`;
                    }}
                    className="bg-transparent py-2 px-4 flex justify-center items-center space-x-4 border border-Gray200 rounded-md">
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google icon"
                        className="w-5 h-5"/>
                    <span className='text-Gray700 text-[4vw] md:text-[1vw] font-Poppins'>Sign in with Google</span>
                </button>

            </div>

            {/* Switch mode button */}
            <button
                onClick={() => {
                    toggleMode();
                    window.scrollTo(0, 0);
                }}
                className='mt-[4vw] md:mt-[1vw] text-[4vw] md:text-[1vw] font-Poppins font-medium'>
                {
                    isRegister
                        ? 'Already have an account? Login'
                        : "Don't have an account? Register"
                }
            </button>
        </div>
    );
};

export default Signin;

import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import PasswordStrengthMeter from "../PasswordStrengthMeter/PasswordStregthMeter";
import {PiUserLight} from "react-icons/pi";
import {GoMail} from "react-icons/go";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import { MdErrorOutline } from "react-icons/md";
import {LuLoader2} from "react-icons/lu";
import {useAuthStore} from "../../store/authStore";
import Role from '../Popups/Role';
import {GoogleLogin} from '@react-oauth/google';
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

    // Function to decode JWT tokens
    const decodeJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    };

    // Handle successful Google login
    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const token = credentialResponse.credential;

            // Decode the JWT token to get user information
            const decodedToken = decodeJwt(token);
            const userEmail = decodedToken.email;

            // Check if user exists in database
            const userExists = await checkUserInDatabase(userEmail);

            if (userExists) {
                // User exists, directly sign in
                await googleSignIn(token);
                window.scrollTo(0, 0);
                navigate("/"); // Redirect to home
            } else {
                // New user, show role selection
                setIsRoleSelectionVisible(true);
                localStorage.setItem("googleToken", token); // Temporarily store token
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error("Error during Google Sign-In:", error);
            toast.error("Failed to sign in. Please try again.");
        }
    };

    // Function to check if user exists in the database
    const checkUserInDatabase = async (email) => {
        try {
            const response = await axios.get(`${API_URL}/google-check`, {params: {
                    email
                }});

            // Check if the response status is OK (200)
            if (response.status !== 200) {
                throw new Error('Failed to check user');
            }

            // Explicitly check if the user exists
            return response.data.user
                ? true
                : false; // Return true if user exists, false otherwise
        } catch (error) {
            console.error("Error checking user in database:", error);
            throw error; // Re-throw the error to handle it in the calling function
        }
    };

    // Handle role selection after new user sign-in
    const handleRoleSelection = async (selectedRole) => {
        const token = localStorage.getItem("googleToken");
        if (token) {
            try {
                await googleSignIn(token, selectedRole);
                localStorage.removeItem("googleToken"); // Clear token from local storage
                window.scrollTo(0, 0);
                navigate("/"); // Redirect to home
            } catch (error) {
                console.error("Error during role-based Google Sign-In:", error);
                toast.error("Google Sign-In failed. Please try again.");
            }
        }
        setIsRoleSelectionVisible(false); // Hide role selection modal
    };

    const handleGoogleLoginError = () => {
        console.error("Google Sign-In failed");
        toast.error("Google Sign-In failed. Please try again.");
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
                            className='w-full outline-none border border-Gray200 px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[2.5vw] focus:border-Primary'
                            onChange={(e) => setName(e.target.value)}/>
                        <div className="absolute inset-y-0 right-[3vw] md:right-[1vw] flex items-center">
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
                    className='w-full outline-none border border-Gray200 px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[2.5vw] focus:border-Primary'
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmail(email.toLowerCase())}/>
                <div className="absolute inset-y-0 right-[3vw] md:right-[1vw] flex items-center">
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
                    className='w-full outline-none border border-Gray200 px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[2.5vw] focus:border-Primary'
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
            {error && <p className='text-red-500 flex items-start gap-1 font-medium text-[4vw] md:text-[1vw] mt-2 font-Poppins'><MdErrorOutline className='text-[5vw] md:text-[1.2vw]'/> {error}</p>}

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
                    : 'bg-Primary hover:bg-HardPrimary'} text-White font-Poppins h-[11vw] md:h-[2.5vw] rounded-lg md:rounded-xl`}
                onClick={() => {
                    if (isRegister) {
                        handleRegister();
                    } else {
                        handleLogin();
                    }
                }}
                disabled={isLoading || (isRegister && !termsAccepted)}> {/* Disable if loading or terms are not accepted */}
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

            {/* Sign in with Google button */}
            <div className="flex flex-col mt-[4vw] md:mt-[1vw]">
                <div className="flex items-center mb-[4vw] md:mb-[1vw]">
                    <div className="flex-1 border-t border-Gray300 mr-2"></div>
                    <span className='text-Gray700 text-[3.5vw] md:text-[1vw] font-Poppins'>OR</span>
                    <div className="flex-1 border-t border-Gray300 ml-2"></div>
                </div>
                <GoogleLogin
                    onSuccess={handleGoogleLoginSuccess}
                    onError={handleGoogleLoginError}
                    useOneTap={true}
                    theme="outline"
                    text="Sign in with Google"
                    shape="rectangular"/>

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

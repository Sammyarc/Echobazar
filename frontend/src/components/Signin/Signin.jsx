import {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import PasswordStrengthMeter from "../PasswordStrengthMeter/PasswordStregthMeter";
import {PiUserLight} from "react-icons/pi";
import {GoMail} from "react-icons/go";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {LuLoader2} from "react-icons/lu";
import {useAuthStore} from "../../store/authStore";
import Role from '../Popups/Role';
import {GoogleLogin} from '@react-oauth/google';
import toast from "react-hot-toast";

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
            toast.error("Failed to sign in. Please try again.", {
                position: toast.POSITION.TOP_CENTER,
                style: {
                    width: '60%',
                    margin: '0', // Remove default margin if needed
                    padding: '10px', // Adjust padding if necessary
                    boxSizing: 'border-box', // Make sure padding is included in total width
                }
            });
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
                toast.error("Google Sign-In failed. Please try again.", {
                    position: toast.POSITION.TOP_CENTER,
                    style: {
                        width: '60%',
                        margin: '0', // Remove default margin if needed
                        padding: '10px', // Adjust padding if necessary
                        boxSizing: 'border-box', // Make sure padding is included in total width
                    }
                });
            }
        }
        setIsRoleSelectionVisible(false); // Hide role selection modal
    };

    const handleGoogleLoginError = () => {
        console.error("Google Sign-In failed");
        toast.error("Google Sign-In failed. Please try again.", {
            position: toast.POSITION.TOP_CENTER,
            style: {
                width: '60%',
                margin: '0', // Remove default margin if needed
                padding: '10px', // Adjust padding if necessary
                boxSizing: 'border-box', // Make sure padding is included in total width
            }
        });
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
    };

    // Toggle Remember Me checkbox
    const handleRememberMe = () => {
        setRememberMe(!rememberMe);
    };

    const handleTermsAcceptance = (e) => {
        setTermsAccepted(e.target.checked);
    };

    // Register handler
    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await signup(email, password, name);
            window.scrollTo(0, 0);
            navigate("/verify-email");
        } catch (error) {
            console.log(error);
        }
    };

    // Login handler
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            window.scrollTo(0, 0);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className='w-[30vw] flex flex-col mx-auto my-[8vw] bg-White shadow-xl p-[2vw] rounded-[0.5vw]'>
            <h2
                className='text-center font-Poppins text-[2vw] font-semibold text-Gray900 mb-[1vw]'>
                {
                    isRegister
                        ? 'Create Account'
                        : 'Sign In'
                }
            </h2>

            {/* Name input only visible in register mode */}
            {
                isRegister && (
                    <div className="relative mt-[1vw]">
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            className='w-full outline-none border border-Gray100 px-[1vw] py-[0.5vw] rounded-[0.5vw] font-Poppins pr-[2.5vw] focus:border-2 focus:border-Gray700'
                            onChange={(e) => setName(e.target.value)}/>
                        <div className="absolute inset-y-0 right-[1vw] flex items-center">
                            <PiUserLight className="fa fa-user text-Gray600 text-[1.3vw]"/>
                        </div>
                    </div>
                )
            }

            {/* Email input */}
            <div className="relative mt-[1vw]">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    className='w-full outline-none border border-Gray100 px-[1vw] py-[0.5vw] rounded-[0.5vw] font-Poppins pr-[2.5vw] focus:border-2 focus:border-Gray700'
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmail(email.toLowerCase())}/>
                <div className="absolute inset-y-0 right-[1vw] flex items-center">
                    <GoMail className="text-Gray600 text-[1.3vw]"/>
                </div>
            </div>

            {/* Password input */}
            <div className="relative mt-[1vw]">
                <input
                    type={isPasswordVisible
                        ? 'text'
                        : 'password'}
                    placeholder="Password"
                    value={password}
                    className='w-full outline-none border border-Gray100 px-[1vw] py-[0.5vw] rounded-[0.5vw] font-Poppins pr-[2.5vw] focus:border-2 focus:border-Gray700'
                    onChange={(e) => setPassword(e.target.value)}/>
                <div
                    className="absolute inset-y-0 right-[1vw] flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}>
                    {
                        isPasswordVisible
                            ? <FaEyeSlash className="text-Gray600 text-[1.3vw]"/>
                            : <FaEye className="text-Gray600 text-[1.3vw]"/>
                    }
                </div>
            </div>

            {/* Role selection for registration */}
            {
                isRegister && (
                    <div className="mt-[1vw]">
                        <label className="text-[1vw] text-Gray700 font-Poppins mb-[0.5vw]">What do you intend to use our platform as?</label>
                        <div className="flex space-x-4 mt-[0.5vw]">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="buyer"
                                    checked={role === 'buyer'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="hidden peer"/>
                                <div
                                    className="w-[1.2vw] h-[1.2vw] rounded-full border-[0.1vw] border-gray-500 bg-gray-200 peer-checked:bg-Primary flex items-center justify-center cursor-pointer">
                                    {role === 'buyer' && <div className="w-[0.6vw] h-[0.6vw] bg-white rounded-full"></div>}
                                </div>
                                <span className="ml-2 font-Poppins text-Gray700 text-[1vw]">Buyer</span>
                            </label>

                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="seller"
                                    checked={role === 'seller'}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="hidden peer"/>
                                <div
                                    className="w-[1.2vw] h-[1.2vw] rounded-full border-[0.1vw] border-gray-500 bg-gray-200 peer-checked:bg-Primary flex items-center justify-center cursor-pointer">
                                    {role === 'seller' && <div className="w-[0.6vw] h-[0.6vw] bg-white rounded-full"></div>}
                                </div>
                                <span className="ml-2 font-Poppins text-Gray700 text-[1vw]">Seller</span>
                            </label>

                        </div>
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
            {error && <p className='text-red-500 font-medium text-[1vw] mt-2 font-Poppins'>{error}</p>}

            {/* Password Strength Meter only in register mode */}
            {isRegister && <PasswordStrengthMeter password={password}/>}

            {/* Checkbox for "Remember Me" or "Terms Acceptance" */}
            <div className="flex justify-between items-center mt-[1vw]">
                {
                    isRegister
                        ? (
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={termsAccepted}
                                    onChange={handleTermsAcceptance}
                                    className="h-[1vw] w-[1vw] rounded-[0.2vw] accent-Primary cursor-pointer"/>
                                <span className="text-[0.9vw] text-Gray700 font-Poppins">I accept the Terms and Conditions</span>
                            </label>
                        )
                        : (
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={handleRememberMe}
                                    className="h-[1vw] w-[1vw] rounded-[0.2vw] accent-Primary cursor-pointer"/>
                                <span className="text-[0.9vw] text-Gray700 font-Poppins">Remember Me</span>
                            </label>
                        )
                }

                {
                    !isRegister && (
                        <Link
                            to="/forgot-password"
                            onClick={toggleForgotPasswordMode}
                            className="text-[0.9vw] text-Gray700 font-Poppins hover:underline">
                            Forgot Password?
                        </Link>
                    )
                }
            </div>

            {/* Submit button */}
            <button
                className={`mt-[1vw] ${isLoading
                    ? 'bg-Gray500 cursor-not-allowed'
                    : 'bg-Primary hover:bg-HardPrimary'} text-White font-Poppins h-[2.5vw] rounded-full`}
                onClick={() => {
                    if (isRegister) {
                        handleRegister();
                    } else {
                        handleLogin();
                    }
                    window.scrollTo(0, 0);
                }}
                disabled={isLoading}>
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
            <div className="flex flex-col mt-[1vw]">
                <div className="flex items-center mb-[1vw]">
                    <div className="flex-1 border-t border-Gray300 mr-2"></div>
                    <span className='text-Gray700 text-[1vw] font-Poppins'>OR</span>
                    <div className="flex-1 border-t border-Gray300 ml-2"></div>
                </div>
                <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} useOneTap={true} theme="outline" text="Sign in with Google" shape="rectangular" style={{
                        width: '100%'
                    }}
                    // Set width with inline styling or through a CSS class
                />

            </div>

            {/* Switch mode button */}
            <button
                onClick={() => {
                    toggleMode();
                    window.scrollTo(0, 0);
                }}
                className='mt-[1vw] text-[0.9vw] font-Poppins'>
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

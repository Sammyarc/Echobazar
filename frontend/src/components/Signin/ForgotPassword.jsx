import {useState} from "react";
import {useAuthStore} from "../../store/authStore";
import {useNavigate, useParams} from "react-router-dom";
import { toast } from 'react-toastify';
import {FaEye, FaEyeSlash, FaSpinner} from 'react-icons/fa';

const ForgotPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const {resetPassword, error, isLoading, message} = useAuthStore();

    const [isPasswordVisible, setPasswordVisible] = useState(false); // State for password visibility

    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility

    // Function to toggle confirm password visibility
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisible(!isConfirmPasswordVisible);
    };

    const {token} = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the password or confirm password fields are empty
        if (!password || !confirmPassword) {
            toast.error("Both password fields are required");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await resetPassword(token, password);
            toast.success("Password reset successfully, login to continue");
                navigate("/signup");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error resetting password");
        }
    };

    return (
        <div className='flex justify-center items-center h-screen'>
             <div
            className='w-[90vw] md:w-[30vw] flex flex-col mx-auto my-[8vw] bg-White shadow-xl px-[2.5vw] py-[7vw] md:p-[2vw] rounded-[0.5vw]'>
            <h2
                className='text-center font-Poppins text-[7vw] md:text-[2.5vw] font-semibold text-Gray900 mb-[1vw]'>
                Reset Password
            </h2>
            {error && <p className='text-red-500 text-[1.2vw] mb-2'>{error}</p>}
            {message && <p className='text-Primary text-[1.2vw] mb-2'>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="relative mt-[3vw] md:mt-[1vw]">
                    <input
                        type={isPasswordVisible
                            ? 'text'
                            : 'password'}
                        placeholder="Password"
                        value={password}
                        className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[9vw] md:pr-[3vw] focus:border-Primary'
                        onChange={(e) => setPassword(e.target.value)}/>
                    <div
                        className="absolute inset-y-0 right-[3vw] md:right-[1vw] flex items-center cursor-pointer"
                        onClick={togglePasswordVisibility}>
                        {
                            isPasswordVisible
                                ? (<FaEyeSlash className="text-Gray600 text-[5.5vw] md:text-[1.3vw]"/>)
                                : (<FaEye className="text-Gray600 text-[5.5vw] md:text-[1.3vw]"/>)
                        }
                    </div>
                </div>

                <div className="relative mt-[3vw] md:mt-[1vw]">
                    <input
                        type={isConfirmPasswordVisible
                            ? 'text'
                            : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        className='w-full outline-none border border-Gray200 bg-transparent px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[9vw] md:pr-[3vw] focus:border-Primary'
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <div
                        className="absolute inset-y-0 right-[3vw] md:right-[1vw] flex items-center cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}>
                        {
                            isConfirmPasswordVisible
                                ? (<FaEyeSlash className="text-Gray600 text-[5.5vw] md:text-[1.3vw]"/>)
                                : (<FaEye className="text-Gray600 text-[5.5vw] md:text-[1.3vw]"/>)
                        }
                    </div>
                </div>

                <button
                    className={`flex items-center justify-center text-White font-Poppins h-[11vw] md:h-[3vw] rounded-lg md:rounded-xl mt-[4vw] md:mt-[1vw] bg-Primary hover:bg-HardPrimary w-full 
                        ${isLoading
                        ? 'cursor-not-allowed opacity-70'
                        : ''}`}
                    type='submit'
                    disabled={isLoading}>
                    {
                        isLoading
                            ? (
                                <div className="flex items-center space-x-2">
                                    <FaSpinner className="animate-spin w-5 h-5"/> {/* Spinner Icon */}
                                    <span>Resetting...</span>
                                </div>
                            )
                            : ("Set New Password")
                    }
                </button>
            </form>
        </div>
        </div>
       
    );
};

export default ForgotPassword;

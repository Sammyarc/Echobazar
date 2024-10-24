import {useState} from "react";
import {useAuthStore} from "../../store/authStore";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
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
            toast.error("Both password fields are required", {
				position: toast.POSITION.TOP_CENTER,
				style: {
					width: '60%',
					margin: '0',  // Remove default margin if needed
					padding: '10px',  // Adjust padding if necessary
					boxSizing: 'border-box',  // Make sure padding is included in total width
				},
			});
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match", {
				position: toast.POSITION.TOP_CENTER,
				style: {
					width: '60%',
					margin: '0',  // Remove default margin if needed
					padding: '10px',  // Adjust padding if necessary
					boxSizing: 'border-box',  // Make sure padding is included in total width
				},
			});
            return;
        }
        try {
            await resetPassword(token, password);

            toast.success("Password reset successfully, redirecting to login page...", {
				position: toast.POSITION.TOP_CENTER,
				style: {
					width: '60%',
					margin: '0',  // Remove default margin if needed
					padding: '10px',  // Adjust padding if necessary
					boxSizing: 'border-box',  // Make sure padding is included in total width
				},
			});
            setTimeout(() => {
                navigate("/signup");
            }, 3000);
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error resetting password");
        }
    };

    return (
        <div
            className='w-[30vw] flex flex-col mx-auto my-[8vw] bg-White shadow-xl p-[2vw] rounded-[0.5vw]'>
            <h2
                className='text-center font-Poppins text-[2vw] font-semibold text-Gray900 mb-[1vw]'>
                Reset Password
            </h2>
            {error && <p className='text-red-500 text-[1.2vw] mb-2'>{error}</p>}
            {message && <p className='text-Primary text-[1.2vw] mb-2'>{message}</p>}

            <form onSubmit={handleSubmit}>
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
                                ? (<FaEyeSlash className="text-Gray600 text-[1.3vw]"/>)
                                : (<FaEye className="text-Gray600 text-[1.3vw]"/>)
                        }
                    </div>
                </div>

                <div className="relative mt-[1vw]">
                    <input
                        type={isConfirmPasswordVisible
                            ? 'text'
                            : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        className='w-full outline-none border border-Gray100 px-[1vw] py-[0.5vw] rounded-[0.5vw] font-Poppins pr-[2.5vw] focus:border-2 focus:border-Gray700'
                        onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <div
                        className="absolute inset-y-0 right-[1vw] flex items-center cursor-pointer"
                        onClick={toggleConfirmPasswordVisibility}>
                        {
                            isConfirmPasswordVisible
                                ? (<FaEyeSlash className="text-Gray600 text-[1.3vw]"/>)
                                : (<FaEye className="text-Gray600 text-[1.3vw]"/>)
                        }
                    </div>
                </div>

                <button
                    className={`flex items-center justify-center text-White font-Poppins h-[3vw] rounded-full mt-[1vw] bg-Primary hover:bg-HardPrimary w-full 
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
    );
};

export default ForgotPassword;

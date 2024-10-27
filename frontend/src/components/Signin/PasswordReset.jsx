import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import { GoMail, GoArrowLeft } from "react-icons/go";
import { LuLoader2 } from "react-icons/lu";
import { toast } from 'react-toastify';

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { isLoading, forgotPassword, error, clearError } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if (!email) { 
            toast.error("Please enter a valid email address.");
            return;
        }
        await forgotPassword(email);
        setIsSubmitted(true);
    };

    return (
        <div className='w-[30vw] flex flex-col mx-auto my-[8vw] bg-White shadow-xl p-[2vw] rounded-[0.5vw]'>
            <h2 className='text-center font-Poppins text-[2vw] font-semibold text-Gray900 mb-[1vw]'>
                Forgot Password
            </h2>

            {
                !isSubmitted
                    ? (
                        <form onSubmit={handleSubmit}>
                            <p className='text-Gray700 mb-6 text-center font-Poppins text-[1vw]'>
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>
                            <div className="relative mt-[1vw]">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    className='w-full outline-none border border-Gray100 px-[1vw] py-[0.5vw] rounded-[0.5vw] font-Poppins pr-[2.5vw] focus:border-2 focus:border-Gray700'
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setEmail(email.toLowerCase())}
                                />
                                <div className="absolute inset-y-0 right-[1vw] flex items-center">
                                    <GoMail className="text-Gray600 text-[1.3vw]" />
                                </div>
                            </div>

                            {error && <p className='text-red-500 font-medium mt-2 text-[1vw] font-Poppins'>{error}</p>}

                            <button className='text-White font-Poppins h-[3vw] rounded-full mt-[1vw] bg-Primary hover:bg-HardPrimary w-full' 
                                type='submit' 
                                disabled={isLoading}
                            >
                                {
                                    isLoading
                                        ? (
                                            <div className="flex justify-center items-center space-x-2">
                                                <LuLoader2 className='w-6 h-6 animate-spin' />
                                                <span>Sending Reset Link...</span>
                                            </div>
                                        )
                                        : "Send Reset Link"
                                }
                            </button>

                        </form>
                    )
                    : (
                        <div>
                            <div className='w-16 h-16 bg-Primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                <GoMail className='text-Gray100 text-[1.5vw]' />
                            </div>
                            <p className='text-Gray700 mb-2 font-Poppins text-[1vw] text-center'>
                            Password reset email sent successfully.
                            </p>
                        </div>
                    )
            }

            <div className='px-8 py-4 flex justify-center'>
                <Link
                    to={"/signup"}
                    onClick={() => {
                        clearError(); // Call your clearError function
                        window.scrollTo(0, 0); // Scroll to the top
                    }}
                    className='text-[1vw] font-Poppins text-Primary hover:underline flex items-center'
                >
                    <GoArrowLeft className='text-[1.3vw] mr-2' />
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default PasswordReset;

import {useState} from "react";
import {useAuthStore} from "../../store/authStore";
import {Link} from "react-router-dom";
import {GoMail, GoArrowLeft} from "react-icons/go";
import {LuLoader2} from "react-icons/lu";
import {toast} from 'react-toastify';
import {MdErrorOutline} from "react-icons/md";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {isLoading, forgotPassword, error, clearError} = useAuthStore();

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
        <div className='flex justify-center items-center h-screen'>
             <div
            className='w-[90vw] md:w-[30vw] flex flex-col mx-auto my-[8vw] bg-White shadow-xl px-[2.5vw] py-[7vw] md:p-[2vw] rounded-[0.5vw]'>
            <h2
                className='text-center font-Poppins text-[7vw] md:text-[2.5vw] font-semibold text-Gray900 mb-[1vw]'>
                Forgot Password
            </h2>

            {
                !isSubmitted
                    ? (
                        <form onSubmit={handleSubmit}>
                            <p
                                className='text-Gray700 mb-6 text-center font-Poppins text-[4vw] md:text-[1vw]'>
                                Enter your email address and we&apos;ll send you a link to reset your password.
                            </p>
                            <div className="relative mt-[1vw]">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    className='w-full outline-none border border-Gray300 px-[2.5vw] py-[3vw] md:px-[1vw] md:py-[0.8vw] rounded-[1.5vw] md:rounded-[0.5vw] font-Poppins pr-[9vw] md:pr-[3vw] focus:border-Primary'
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setEmail(email.toLowerCase())}/>
                                <div
                                    className="absolute inset-y-0 right-[3vw] md:right-[1vw] flex items-center">
                                    <GoMail className="text-Gray600 md:text-[1.3vw]"/>
                                </div>
                            </div>

                            {
                                error && <p
                                        className='text-red-500 flex items-center gap-1 font-medium text-[4vw] md:text-[1vw] mt-2 font-Poppins'><MdErrorOutline className='text-[5vw] md:text-[1vw]'/> {error}</p>
                            }

                            <button
                                className={`text-White ${isLoading 
                                    ? 'bg-Gray500 cursor-not-allowed'
                                    : 'bg-Primary hover:bg-HardPrimary'} font-Poppins h-[10vw] md:h-[3vw] rounded-lg md:rounded-xl mt-[4vw] md:mt-[1vw] w-full`}
                                type='submit'
                                disabled={isLoading}>
                                {
                                    isLoading
                                        ? (
                                            <div className="flex justify-center items-center space-x-2">
                                                <LuLoader2 className='w-6 h-6 animate-spin'/>
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
                            <div
                                className='w-10 h-10 mt-[2vw] md:w-16 md:h-16 bg-Primary rounded-full flex items-center justify-center mx-auto mb-4'>
                                <GoMail className='text-Gray100 md:text-[1.3vw]'/>
                            </div>
                            <p
                                className='text-Gray700 mb-2 font-Poppins text-[4vw] md:text-[1vw] text-center'>
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
                    className='text-[4vw] md:text-[1vw] font-Poppins text-Primary hover:underline flex items-center'>
                    <GoArrowLeft className='text-[6vw] md:text-[1.3vw] mr-2'/>
                    Back to Login
                </Link>
            </div>
        </div>
        </div>
       
    );
};

export default PasswordReset;

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, isLoading, verifyEmail } = useAuthStore();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			navigate("/");
			toast.success("Email verified successfully, Continue Shopping!", {
				position: toast.POSITION.TOP_CENTER,
				style: {
					width: '60%',
					margin: '0',  // Remove default margin if needed
					padding: '10px',  // Adjust padding if necessary
					boxSizing: 'border-box',  // Make sure padding is included in total width
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code]);

	return (
		<div className='w-[30vw] flex flex-col mx-auto my-[8vw] bg-White shadow-xl p-[2vw] rounded-[0.5vw]'>
				<h2 className='text-3xl font-bold mb-6 text-center text-Primary font-Poppins'>
					Verify Your Email
				</h2>
				<p className='text-center text-Gray700 font-Poppins mb-6'>Enter the 6-digit code sent to your email address.</p>

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='flex justify-between'>
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el)}
								type='text'
								maxLength='6'
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								className='w-12 h-12 text-center text-2xl font-Poppins font-bold bg-Gray50 text-Gray800 border-2 border-Gray100 rounded-lg focus:border-Primary focus:outline-none'
							/>
						))}
					</div>
					{error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
					<button
						type='submit'
						disabled={isLoading || code.some((digit) => !digit)}
						className='w-full bg-Primary hover:bg-HardPrimary text-White font-Poppins h-[3vw] rounded-full  disabled:bg-Gray300 disabled:cursor-not-allowed'
					>
						{isLoading ? "Verifying..." : "Verify Email"}
					</button>
				</form>
		</div>
	);
};
export default EmailVerificationPage;

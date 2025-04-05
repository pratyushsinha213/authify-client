import React, { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { CircleAlert } from 'lucide-react';

const VerifyEmailPage = () => {

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const { isLoading, error, verifyEmail } = useAuthStore();

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
	}


    const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleVerification = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			navigate("/");
			// toast.success("Email verified successfully");
		} catch (error) {
			console.log(error);
		}
	};

    // Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleVerification(new Event("submit"));
		}
	}, [code, handleVerification]);


    return (
        <div className='w-full max-w-md overflow-hidden shadow-xl bg-gray-800/80 rounded-2xl'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md p-8 shadow-2xl bg-gray-800/80 backdrop-filter'
            >
                <h2 className='mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text'>
                    Verify Your Email
                </h2>
                <p className='mb-6 text-center text-gray-300'>Enter the 6-digit code sent to your email address.</p>

                <form className='space-y-6' onSubmit={handleVerification}>
                    <div className="flex justify-between">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => inputRefs.current[index] = el}
                                type='text'
                                maxLength='6'
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className='text-2xl font-bold text-center text-white bg-gray-700 border-2 border-gray-600 rounded-lg size-12 focus:border-green-500 focus:outline-none'
                            />
                        ))}
                    </div>

                    {error && (
                        <div className='flex items-center justify-center gap-2'>
                            <CircleAlert className='mt-2 text-red-500 size-6' />
                            <p className='mt-2 font-semibold text-red-500'>
                                {error}
                            </p>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        disabled={isLoading || code.some((digit) => !digit)}
                        className='w-full px-4 py-3 font-bold text-white rounded-lg shadow-lg cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50'
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </motion.button>
                </form>
            </motion.div>
        </div >
    )
}

export default VerifyEmailPage 
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import Input from '@/components/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { ArrowLeft, Loader, Mail } from 'lucide-react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const { error, forgotPassword, isLoading } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await forgotPassword(email);
        setIsSubmitted(true);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full max-w-md p-10 overflow-hidden shadow-xl bg-gray-800/80 rounded-2xl'
        >
            <h2 className='mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text'>
                Forgot Password
            </h2>

            {!isSubmitted ? (
                <div>
                    <form onSubmit={handleSubmit}>
                        <p className='mb-6 text-center text-gray-300'>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        <Input
                            icon={Mail}
                            type='email'
                            placeholder='Email Address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='w-full px-4 py-3 font-bold text-white transition duration-200 rounded-lg shadow-lg cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                            type='submit'
                        >
                            {isLoading ? <Loader className='mx-auto size-6 animate-spin' /> : "Send Reset Link"}
                        </motion.button>
                    </form>
                    <div className='flex items-center justify-center mx-auto mt-5 hover:scale-[1.02]'>
                        <ArrowLeft className='text-white' />
                        <Link className='text-white' to='/login'>Back to Login</Link>
                    </div>
                </div>
            ) : (
                <div>
                    <div className='flex flex-col items-center justify-center gap-3'>
                        <Mail className='mb-2 text-white size-12 animate-bounce' />
                        <p className='mb-6 text-center text-gray-300'>
                            If an account exists for <span className='font-semibold text-emerald-500'>{email}</span>, then you will receive an email for a password reset shortly.
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full px-4 py-3 font-bold text-white transition duration-200 rounded-lg shadow-lg cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                        type='submit'
                        onClick={() => navigate('/login')}
                    >
                        <div className='flex items-center justify-center gap-2'>
                            <ArrowLeft className='font-semibold' />
                            Back to Login
                        </div>
                    </motion.button>
                </div>
            )}

        </motion.div>
    )
}

export default ForgotPasswordPage
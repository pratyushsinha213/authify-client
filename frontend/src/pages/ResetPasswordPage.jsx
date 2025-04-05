// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import Input from '@/components/Input';
import { useAuthStore } from '@/store/useAuthStore';
import { CircleAlert, CircleCheckBig, Loader, Lock } from 'lucide-react';
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

const ResetPasswordPage = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, error, message, isLoading } = useAuthStore();

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await resetPassword(password, confirmPassword, token);

            if (response.data.message === "Password reset successfully.") {
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
            
            // setTimeout(() => {
            //     navigate('/login');
            // }, 2000);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full max-w-md overflow-hidden shadow-xl bg-gray-800/80 rounded-2xl'
        >
            <div className="p-8">
                <h2 className='mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text'>
                    Reset Password
                </h2>

                <form onSubmit={handleSubmit}>
                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Input
                        icon={Lock}
                        type='password'
                        placeholder='Confirm New Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div className='flex items-center justify-center gap-2 mx-auto text-center'>
                            <CircleAlert className='mb-4 text-red-500 size-5' />
                            <p className='mb-4 text-sm text-red-500'>{error}</p>
                        </div>
                    )}
                    {message && (
                        <div className='flex items-center justify-center gap-2 mx-auto'>
                            <CircleCheckBig className='mb-4 size-5 text-emerald-500' />
                            <p className='mb-4 text-sm text-emerald-500'>{message}</p>
                        </div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='w-full px-4 py-3 font-bold text-white transition duration-200 rounded-lg shadow-lg cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className='flex items-center justify-center gap-2 text-gray-300'>
                                <Loader className='text-gray-300 size-6 animate-spin' />
                                <p>Resetting...</p>
                            </div>
                        ) : (
                            "Reset Password"
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    )
}

export default ResetPasswordPage
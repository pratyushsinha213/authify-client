import React, { useState } from 'react'
import { Lock, Mail, Loader2, Loader, CircleAlert } from 'lucide-react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import Input from '@/components/Input';
import { Link } from 'react-router-dom';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { useAuthStore } from '@/store/useAuthStore';


const LoginPage = () => {

    const { isLoading, login, error } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        await login(email, password);
    }
    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='w-full max-w-md overflow-hidden shadow-xl bg-gray-800/80 rounded-2xl'
        >
            <div className="p-8">
                <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
                    Login to Account
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        icon={Mail}
                        placeholder="Email"
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <Input
                        icon={Lock}
                        placeholder="Password"
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                    <div className='flex items-center justify-end'>
                        <Link className='text-sm text-green-500 hover:underline hover:text-green-600' to={'/forgot-password'}>Forgot Password?</Link>
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
                        className='w-full px-4 py-3 mt-5 font-bold text-white transition duration-200 rounded-lg shadow-lg cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type='submit'
                        disabled={isLoading}
                    >
                        {isLoading ? (<Loader2 className='mx-auto size-6 animate-spin' />) : "Login"}
                    </motion.button>
                    {/* <Button /> */}
                </form>
            </div>

            <div className="flex justify-center px-8 py-4 bg-gray-900/80">
                <p className="text-sm text-center text-gray-400">
                    Don't have an account? {' '}
                    <Link className='text-emerald-500 hover:text-green-500 hover:underline' to={'/register'}>Register</Link>
                </p>
            </div>
        </motion.div>

    )
}

export default LoginPage
import React, { useState } from 'react'
import { User, Lock, Mail, Loader, CircleAlert } from 'lucide-react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import Input from '@/components/Input';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter';
import { useAuthStore } from '@/store/useAuthStore.js';

const RegisterPage = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { register, error, isLoading } = useAuthStore();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await register(email, password, name);
            navigate('/verify-email');
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
                <h2 className="mb-6 text-3xl font-bold text-center text-transparent bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">
                    Create Account
                </h2>
                <form onSubmit={handleRegister} className="space-y-4">
                    <Input
                        icon={User}
                        placeholder="Full name"
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
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
                    {/* Password Strength Meter */}

                    <PasswordStrengthMeter password={password} />

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
                        {isLoading ? (<Loader className='mx-auto animate-spin size-6' />) : "Register"}
                    </motion.button>
                </form>
            </div>

            <div className="flex justify-center px-8 py-4 bg-gray-900/80">
                <p className="text-sm text-center text-gray-400">
                    Already have an account? {' '}
                    <Link className='text-emerald-500 hover:text-green-500 hover:underline' to={'/login'}>Login</Link>
                </p>
            </div>
        </motion.div>

    )
}

export default RegisterPage
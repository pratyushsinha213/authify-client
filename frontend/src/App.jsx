import React, { useEffect } from 'react'
import FloatingShape from '@/components/FloatingShape'
import { Navigate, Route, Routes } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage'
import LoginPage from '@/pages/LoginPage'
import VerifyEmailPage from '@/pages/VerifyEmailPage'
import HomePage from '@/pages/HomePage'
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuthStore } from './store/useAuthStore'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    if (!user.isVerified) {
        return <Navigate to='/verify-email' replace />;
    }

    return children;
};

// redirect authenticated users to the home page
const RedirectAuthenticatedUsers = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (isAuthenticated && user.isVerified) {
        return <Navigate to='/' replace />;
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    return (
        <div className='relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900'>
            <FloatingShape
                color="bg-green-500"
                size="size-64"
                top="-5%"
                left="10%"
                delay={0}
            />
            <FloatingShape
                color="bg-emerald-500"
                size="size-48"
                top="70%"
                left="80%"
                delay={5}
            />
            <FloatingShape
                color="bg-lime-500"
                size="size-32"
                top="40%"
                left="-10%"
                delay={2}
            />

            <Routes>
                <Route path='/' element={<ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>} />
                <Route path='/register' element={<RedirectAuthenticatedUsers>
                    <RegisterPage />
                </RedirectAuthenticatedUsers>} />
                <Route path='/login' element={<RedirectAuthenticatedUsers>
                    <LoginPage />
                </RedirectAuthenticatedUsers>} />
                <Route path='/verify-email' element={<VerifyEmailPage />} />
                <Route path='/forgot-password' element={<RedirectAuthenticatedUsers>
                    <ForgotPasswordPage />
                </RedirectAuthenticatedUsers>} />
                <Route path='/reset-password/:token' element={<RedirectAuthenticatedUsers>
                    <ResetPasswordPage />
                </RedirectAuthenticatedUsers>} />
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
        </div>
    )
}

export default App
import { create } from 'zustand'
import { axiosInstance } from '@/lib/axios';

// Add toast messages here later

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isCheckingAuth: true,

    register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        const payload = { email, password, name };
        try {
            const response = await axiosInstance.post('/auth/register', payload);
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            set({ error: error.response.data.message || "Error registering the user" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        const payload = { email, password };
        try {
            const response = await axiosInstance.post('/auth/login', payload);
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            set({ error: error.response.data.message || "Error in logging in the user" });
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await axiosInstance.post('/auth/logout');
            set({ isLoading: false, user: null, isAuthenticated: false })
        } catch (error) {
            set({ error: error.response.message.data || "Error logging out" });
        } finally {
            set({ isLoading: false });
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/verify-email', { code });
            set({ user: response.data.user, isAuthenticated: true });
            return response.data
        } catch (error) {
            set({ error: error.response.data.message || "Error verifying the user" });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
            const response = await axiosInstance.get('/auth/check-auth');
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
            console.log(error);
            set({ error: null, isAuthenticated: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            set({ message: response.data.message });
        } catch (error) {
            console.log(error)
        } finally {
            set({ isLoading: false });
        }
    },

    resetPassword: async (password, confirmPassword, token) => {
        set({ error: null, isLoading: true });
        try {
            const response = await axiosInstance.post(`/auth/reset-password/${token}`, { password, confirmPassword });
            set({ message: response.data.message });
        } catch (error) {
            set({ error: error.response.data.message });
        } finally {
            set({ isLoading: false });
        }
    }
}));

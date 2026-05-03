'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

type UserType = 'patient' | 'doctor';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [userType, setUserType] = useState<UserType>('patient');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Step 1: Login and get tokens
      console.log('Attempting login for:', formData.username);
      const response = await api.post('/auth/login/', formData);
      
      if (!response.data.access || !response.data.refresh) {
        throw new Error('Invalid response from server');
      }
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      console.log('Tokens stored successfully');
      
      // Step 2: Fetch user profile
      const userResponse = await api.get('/auth/profile/');
      console.log('User profile fetched:', userResponse.data);
      setUser(userResponse.data);
      
      // Step 3: Verify user role matches selected type
      if (userType === 'doctor' && userResponse.data.role !== 'doctor') {
        const errorMsg = 'Please use the Patient/User login for your account';
        setError(errorMsg);
        toast.error('Wrong Login Type', {
          description: errorMsg,
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setLoading(false);
        return;
      }
      
      if (userType === 'patient' && userResponse.data.role === 'doctor') {
        const errorMsg = 'Please use the Doctor login for your account';
        setError(errorMsg);
        toast.error('Wrong Login Type', {
          description: errorMsg,
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setLoading(false);
        return;
      }
      
      // Step 4: Show success toast
      const userName = userResponse.data.first_name || userResponse.data.username;
      toast.success(`Welcome back, ${userName}!`, {
        description: 'You have successfully logged in.',
      });
      
      // Step 5: Redirect to dashboard
      console.log('Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMsg = 'Login failed. Please check your credentials.';
      
      if (err.response?.status === 401) {
        errorMsg = 'Invalid username or password. Please try again.';
      } else if (err.response?.data?.detail) {
        errorMsg = err.response.data.detail;
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      toast.error('Login Failed', {
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
            <span className="material-symbols-outlined text-white text-[32px]">medical_services</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MediBook</h1>
          <p className="text-gray-500 mt-2">Healthcare Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Log in</h2>

          {/* User Type Tabs */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                userType === 'patient'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Patient / User
            </button>
            <button
              type="button"
              onClick={() => setUserType('doctor')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                userType === 'doctor'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Doctor
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Username/Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">
                  person
                </span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">
                  lock
                </span>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-gray-900 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-gray-900 font-semibold hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2024 MediBook. All rights reserved.
        </p>
      </div>
    </div>
  );
}

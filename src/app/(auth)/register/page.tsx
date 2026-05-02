'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password2: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
}).refine((data) => data.password === data.password2, {
  message: "Passwords don't match",
  path: ["password2"],
});

type RegisterForm = z.infer<typeof registerSchema>;
type UserType = 'patient' | 'doctor';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<UserType>('patient');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Profile picture must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      
      setProfilePicture(file);
      setError('');
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('password2', data.password2);
      formData.append('first_name', data.first_name);
      formData.append('last_name', data.last_name);
      formData.append('role', userType);
      if (data.phone) {
        formData.append('phone', data.phone);
      }
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      await api.post('/auth/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
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
          <p className="text-gray-500 mt-2">Create your account</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Register</h2>

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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {/* Profile Picture Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture <span className="text-gray-400">(optional)</span>
              </label>
              <div className="flex items-center gap-4">
                {/* Preview */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="material-symbols-outlined text-gray-400 text-[48px]">
                      account_circle
                    </span>
                  )}
                </div>
                
                {/* Upload/Remove Buttons */}
                <div className="flex-1">
                  {!profilePicture ? (
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all">
                      <span className="material-symbols-outlined text-[20px]">upload</span>
                      <span className="text-sm font-medium">Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 truncate">{profilePicture.name}</p>
                      <button
                        type="button"
                        onClick={removeProfilePicture}
                        className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Remove
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Max 5MB • JPG, PNG, GIF</p>
                </div>
              </div>
            </div>
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  {...register('first_name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="John"
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  {...register('last_name')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="Doe"
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
              </div>
            </div>
            
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">
                  person
                </span>
                <input
                  {...register('username')}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="johndoe"
                />
              </div>
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">
                  mail
                </span>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">
                  phone
                </span>
                <input
                  {...register('phone')}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">
                  lock
                </span>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[20px]">
                  lock
                </span>
                <input
                  {...register('password2')}
                  type="password"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2.message}</p>}
            </div>
            
            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : `Register as ${userType === 'doctor' ? 'Doctor' : 'Patient'}`}
            </button>
            
            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-gray-900 font-semibold hover:underline">
                Login
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

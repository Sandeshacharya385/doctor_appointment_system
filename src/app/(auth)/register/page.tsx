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
import { toast } from 'sonner';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password2: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().optional(),
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
      if (file.size > 5 * 1024 * 1024) {
        const errorMsg = 'Profile picture must be less than 5MB';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        const errorMsg = 'Please select a valid image file';
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }
      
      setProfilePicture(file);
      setError('');
      toast.success('Profile picture selected');
      
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
    toast.info('Profile picture removed');
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('username', data.username);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('password2', data.password2);
      formData.append('first_name', data.first_name);
      if (data.last_name) {
        formData.append('last_name', data.last_name);
      }
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
      
      toast.success('Registration Successful!', {
        description: 'Your account has been created. Please log in to continue.',
      });
      
      router.push('/login');
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMsg = '';
      
      if (errorData?.detail) {
        errorMsg = errorData.detail;
      } else if (errorData?.username) {
        errorMsg = Array.isArray(errorData.username) ? errorData.username[0] : errorData.username;
      } else if (errorData?.email) {
        errorMsg = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email;
      } else if (errorData?.password) {
        errorMsg = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
      } else {
        errorMsg = 'Registration failed. Please check your information and try again.';
      }
      
      setError(errorMsg);
      toast.error('Registration Failed', {
        description: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-4 px-4">
      <div className="w-full max-w-4xl">
        {/* Logo/Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 mb-2">
            <span className="material-symbols-outlined text-white text-[24px]">medical_services</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">MediBook</h1>
          <p className="text-gray-500 text-sm mt-1">Create your account</p>
        </div>

        {/* Registration Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Register</h2>

          {/* User Type Tabs */}
          <div className="flex gap-2 mb-4 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setUserType('patient')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
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
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                userType === 'doctor'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Doctor
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-3">
                {/* Profile Picture Upload - Compact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt="Profile preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-gray-400 text-[32px]">
                          account_circle
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {!profilePicture ? (
                        <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all text-sm">
                          <span className="material-symbols-outlined text-[18px]">upload</span>
                          <span className="font-medium">Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <button
                          type="button"
                          onClick={removeProfilePicture}
                          className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                    </div>
                  </div>
                </div>
                
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register('first_name')}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder=""
                    />
                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name <span className="text-gray-400 text-xs">(opt)</span>
                    </label>
                    <input
                      {...register('last_name')}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder=""
                    />
                  </div>
                </div>
                
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">
                      person
                    </span>
                    <input
                      {...register('username')}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder=""
                    />
                  </div>
                  {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                </div>
                
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">
                      mail
                    </span>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder=""
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3">
                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-gray-400 text-xs">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">
                      phone
                    </span>
                    <input
                      {...register('phone')}
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder=""
                    />
                  </div>
                </div>
                
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">
                      lock
                    </span>
                    <input
                      {...register('password')}
                      type="password"
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>
                
                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[18px]">
                      lock
                    </span>
                    <input
                      {...register('password2')}
                      type="password"
                      className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.password2 && <p className="text-red-500 text-xs mt-1">{errors.password2.message}</p>}
                </div>
              </div>
            </div>
            
            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
        <p className="text-center text-xs text-gray-500 mt-4">
          © 2024 MediBook. All rights reserved.
        </p>
      </div>
    </div>
  );
}

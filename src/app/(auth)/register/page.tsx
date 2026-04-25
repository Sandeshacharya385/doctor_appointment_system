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

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError('');
    
    try {
      await api.post('/auth/register/', { ...data, role: 'patient' });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input {...register('first_name')} placeholder="First Name" />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>}
              </div>
              <div>
                <Input {...register('last_name')} placeholder="Last Name" />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>}
              </div>
            </div>
            
            <div>
              <Input {...register('username')} placeholder="Username" />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
            </div>
            
            <div>
              <Input {...register('email')} type="email" placeholder="Email" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <Input {...register('phone')} placeholder="Phone (optional)" />
            </div>
            
            <div>
              <Input {...register('password')} type="password" placeholder="Password" />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            <div>
              <Input {...register('password2')} type="password" placeholder="Confirm Password" />
              {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2.message}</p>}
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : 'Register'}
            </Button>
            
            <p className="text-center text-sm">
              Already have an account? <Link href="/login" className="text-primary">Login</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

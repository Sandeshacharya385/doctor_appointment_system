'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (isAuthenticated || localStorage.getItem('access_token')) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-6 max-w-3xl">
        <h1 className="text-6xl font-bold text-gray-900">Doctor Appointment System</h1>
        <p className="text-2xl text-gray-600">Book your appointment with ease and convenience</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-2">🏥</div>
            <h3 className="font-semibold mb-2">Find Doctors</h3>
            <p className="text-sm text-gray-600">Browse qualified doctors by specialization</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-2">📅</div>
            <h3 className="font-semibold mb-2">Book Appointments</h3>
            <p className="text-sm text-gray-600">Schedule appointments at your convenience</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-2">💊</div>
            <h3 className="font-semibold mb-2">Manage Health</h3>
            <p className="text-sm text-gray-600">Track your appointments and medical history</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/login">
            <Button size="lg" className="px-8">Login</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="px-8">Register</Button>
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          Already have an account? Login to access your dashboard
        </p>
      </div>
    </main>
  );
}

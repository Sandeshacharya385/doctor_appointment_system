'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated && !localStorage.getItem('access_token')) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex gap-6">
            <Link href="/dashboard" className="hover:text-primary font-semibold">Dashboard</Link>
            <Link href="/doctors" className="hover:text-primary">Doctors</Link>
            <Link href="/appointments" className="hover:text-primary">My Appointments</Link>
          </div>
          <Button onClick={handleLogout} variant="outline">Logout</Button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

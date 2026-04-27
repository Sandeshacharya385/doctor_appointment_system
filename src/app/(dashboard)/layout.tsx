'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/useUIStore';
import { api } from '@/lib/api';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

// Route access control
const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard': ['patient', 'doctor', 'admin'],
  '/doctor': ['doctor'],
  '/appointments': ['patient', 'doctor', 'admin'],
  '/doctors': ['patient', 'admin'],
  '/payments': ['patient'],
  '/prescriptions': ['patient'],
  '/admin': ['admin'],
  '/profile': ['patient', 'doctor', 'admin'],
  '/settings': ['patient', 'doctor', 'admin'],
  '/help': ['patient', 'doctor', 'admin'],
  '/about': ['patient', 'doctor', 'admin'],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, logout } = useAuthStore();
  const { isSidebarOpen } = useUIStore();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    if (!user) {
      api
        .get('/auth/profile/')
        .then((r) => setUser(r.data))
        .catch(() => {
          logout();
          router.push('/login');
        });
    }
  }, [user, setUser, router, logout]);

  // Route guard — redirect if role not allowed
  useEffect(() => {
    if (!user) return;
    const base = '/' + pathname.split('/')[1];
    const allowed = ROUTE_ROLES[base];
    if (allowed && !allowed.includes(user.role)) {
      router.replace('/dashboard');
    }
  }, [user, pathname, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Content */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        {/* Topbar */}
        <Topbar />

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

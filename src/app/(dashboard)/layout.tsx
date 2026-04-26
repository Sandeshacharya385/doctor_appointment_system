'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

// Route access control
const ROUTE_ROLES: Record<string, string[]> = {
  '/dashboard':    ['patient', 'doctor', 'admin'],
  '/doctor':       ['doctor'],
  '/appointments': ['patient', 'doctor', 'admin'],
  '/doctors':      ['patient', 'admin'],
  '/payments':     ['patient'],
  '/prescriptions':['patient'],
  '/admin':        ['admin'],
};

const NAV_ITEMS = [
  { href: '/dashboard',     icon: 'dashboard',             label: 'Dashboard',      roles: ['patient','doctor','admin'] },
  { href: '/doctor',        icon: 'stethoscope',           label: 'Doctor Panel',   roles: ['doctor'] },
  { href: '/appointments',  icon: 'event',                 label: 'Appointments',   roles: ['patient','doctor','admin'] },
  { href: '/prescriptions', icon: 'medication',            label: 'Prescriptions',  roles: ['patient'] },
  { href: '/doctors',       icon: 'group',                 label: 'Find Doctors',   roles: ['patient'] },
  { href: '/payments',      icon: 'payments',              label: 'Payments',       roles: ['patient'] },
  { href: '/admin',         icon: 'admin_panel_settings',  label: 'Admin Panel',    roles: ['admin'] },
];

const ROLE_COLOR: Record<string, string> = {
  patient: 'bg-blue-600',
  doctor:  'bg-emerald-600',
  admin:   'bg-purple-600',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { router.push('/login'); return; }
    if (!user) {
      api.get('/auth/profile/')
        .then(r => setUser(r.data))
        .catch(() => { logout(); router.push('/login'); });
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

  const handleLogout = () => { logout(); router.push('/login'); };

  const navItems = NAV_ITEMS.filter(i => i.roles.includes(user?.role || 'patient'));
  const avatarBg = ROLE_COLOR[user?.role || 'patient'];
  const fullName = user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username || '';

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-slate-100 bg-slate-50 flex flex-col p-4 z-50">
        {/* Logo */}
        <div className="flex items-center px-2 py-5 space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>medical_services</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-blue-600">MediBook</h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Appointment System</p>
          </div>
        </div>

        {/* User card */}
        <div className={`${avatarBg} rounded-xl p-3 mb-4 text-white`}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/30">
              {fullName[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{fullName}</p>
              <p className="text-[10px] opacity-75 capitalize font-medium">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium ${
                  isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}>
                <span className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-200">
          <button onClick={handleLogout}
            className="flex items-center space-x-3 px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors text-sm font-medium rounded-lg w-full">
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-8 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
          <div className="text-sm text-slate-500 font-medium capitalize">
            {pathname.split('/')[1] || 'Dashboard'}
          </div>
          <div className="flex items-center space-x-3">
            <button className="hover:bg-slate-100 rounded-full p-2 transition-all">
              <span className="material-symbols-outlined text-slate-500 text-[20px]">notifications</span>
            </button>
            <div className={`w-8 h-8 rounded-full ${avatarBg} flex items-center justify-center text-white font-bold text-sm`}>
              {fullName[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

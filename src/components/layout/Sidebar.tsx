'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/useUIStore';
import { useEffect, useState } from 'react';

interface NavItem {
  href: string;
  icon: string;
  label: string;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard', roles: ['patient', 'doctor', 'admin'] },
  { href: '/doctor', icon: 'stethoscope', label: 'Doctor Panel', roles: ['doctor'] },
  { href: '/appointments', icon: 'event', label: 'Appointments', roles: ['patient', 'admin'] },
  { href: '/prescriptions', icon: 'medication', label: 'Prescriptions', roles: ['patient'] },
  { href: '/doctors', icon: 'group', label: 'Find Doctors', roles: ['patient'] },
  { href: '/payments', icon: 'payments', label: 'Payments', roles: ['patient'] },
  { href: '/admin', icon: 'admin_panel_settings', label: 'Admin Panel', roles: ['admin'] },
  { href: '/profile', icon: 'person', label: 'Profile Settings', roles: ['patient', 'doctor', 'admin'] },
  { href: '/settings', icon: 'settings', label: 'Preferences', roles: ['patient', 'doctor', 'admin'] },
  { href: '/help', icon: 'help', label: 'Help & Support', roles: ['patient', 'doctor', 'admin'] },
  { href: '/about', icon: 'info', label: 'About', roles: ['patient', 'doctor', 'admin'] },
];

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setSidebarOpen]);

  const navItems = NAV_ITEMS.filter((i) => i.roles.includes(user?.role || 'patient'));
  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || '';

  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col z-50 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800 min-h-[73px]">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-gray-800 flex items-center justify-center text-white flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">medical_services</span>
            </div>
            {isSidebarOpen && (
              <div className="ml-3 overflow-hidden">
                <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100 whitespace-nowrap">MediBook</h1>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">Healthcare System</p>
              </div>
            )}
          </div>
          {/* Slide to Hide Button */}
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
            aria-label="Toggle sidebar"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400 text-[20px] transition-transform duration-200 group-hover:scale-110">
              {isSidebarOpen ? 'chevron_left' : 'chevron_right'}
            </span>
          </button>
        </div>

        {/* User info */}
        <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-800 ${!isSidebarOpen && 'px-3'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-semibold text-gray-700 dark:text-gray-300 text-sm flex-shrink-0">
              {fullName[0]?.toUpperCase() || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0 flex-1 overflow-hidden">
                <p className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{fullName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href && (pathname === item.href || pathname.startsWith(item.href + '/'));
            
            return (
              <Link
                key={item.href}
                href={item.href!}
                onClick={handleLinkClick}
                className={`flex items-center ${
                  isSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'
                } py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative ${
                  isActive ? 'bg-gray-900 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-800'
                }`}
                title={!isSidebarOpen ? item.label : ''}
              >
                <span className="material-symbols-outlined text-[20px] flex-shrink-0">{item.icon}</span>
                {isSidebarOpen && <span className="truncate">{item.label}</span>}
                
                {/* Tooltip for collapsed state */}
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`p-3 border-t border-gray-200 ${!isSidebarOpen && 'px-2'}`}>
          <button
            onClick={onLogout}
            className={`flex items-center ${
              isSidebarOpen ? 'space-x-3 px-3' : 'justify-center px-2'
            } py-2.5 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:text-red-600 transition-colors text-sm font-medium rounded-lg w-full group relative`}
            title={!isSidebarOpen ? 'Logout' : ''}
          >
            <span className="material-symbols-outlined text-[20px] flex-shrink-0">logout</span>
            {isSidebarOpen && <span>Logout</span>}
            
            {/* Tooltip for collapsed state */}
            {!isSidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}


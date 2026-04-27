'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/useUIStore';

export default function Topbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || '';

  const pageName = pathname.split('/')[1] || 'Dashboard';

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-4 md:px-8 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        {/* Hamburger Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-gray-600 text-[24px]">menu</span>
        </button>
        
        <div className="text-sm font-medium text-gray-900 capitalize">
          {pageName}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button className="hover:bg-gray-100 rounded-lg p-2 transition-colors">
          <span className="material-symbols-outlined text-gray-600 text-[20px]">
            notifications
          </span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-sm">
          {fullName[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/useUIStore';

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Role-based notifications
  const getNotifications = () => {
    if (user?.role === 'doctor') {
      return [
        { id: 1, title: 'New appointment request', message: 'A patient has requested an appointment', time: '5 min ago', unread: true, link: '/doctor' },
        { id: 2, title: 'Appointment confirmed', message: 'Patient confirmed their appointment', time: '1 hour ago', unread: true, link: '/doctor' },
        { id: 3, title: 'Appointment completed', message: 'Appointment marked as completed', time: '2 hours ago', unread: false, link: '/doctor' },
      ];
    }
    // Patient notifications
    return [
      { id: 1, title: 'New appointment booked', message: 'You have a new appointment scheduled', time: '5 min ago', unread: true, link: '/appointments' },
      { id: 2, title: 'Prescription updated', message: 'Your prescription has been updated', time: '1 hour ago', unread: true, link: '/prescriptions' },
      { id: 3, title: 'Payment received', message: 'Payment of $150 received', time: '2 hours ago', unread: false, link: '/payments' },
    ];
  };
  
  const [notifications, setNotifications] = useState(getNotifications());

  // Update notifications when user role changes
  useEffect(() => {
    if (user) {
      setNotifications(getNotifications());
    }
  }, [user?.role]);

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || '';

  const pageName = pathname.split('/')[1] || 'Dashboard';

  const hasUnreadNotifications = notifications.some(n => n.unread);

  const markAsRead = (notificationId: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, unread: false } : notif
      )
    );
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Close dropdown
    setShowNotifications(false);
    
    // Navigate to the link
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, unread: false }))
    );
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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

      <div className="flex items-center space-x-3 relative">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative hover:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <span className="material-symbols-outlined text-gray-600 text-[20px]">
              notifications
            </span>
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {hasUnreadNotifications && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notif.unread ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                          {notif.unread && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            {fullName[0]?.toUpperCase() || 'U'}
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <p className="font-semibold text-gray-900">{fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                </div>
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/profile');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span>Profile Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/settings');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    <span>Preferences</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      router.push('/help');
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">help</span>
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className="border-t border-gray-200 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

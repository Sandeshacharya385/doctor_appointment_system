'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/useUIStore';
import { api } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { toggleSidebar, isDarkMode, toggleDarkMode } = useUIStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  
  // Get profile picture URL
  const getProfilePictureUrl = () => {
    if (!user?.profile_picture) return null;
    
    // If it's already a full URL, return as is
    if (user.profile_picture.startsWith('http')) {
      return user.profile_picture;
    }
    
    // Otherwise, prepend the backend URL
    const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
    return `${backendUrl}${user.profile_picture}`;
  };
  
  const profilePictureUrl = getProfilePictureUrl();

  // Fetch notifications from API
  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    setLoadingNotifications(true);
    try {
      const response = await api.get('/notifications/');
      // Ensure we always set an array
      const data = Array.isArray(response.data) ? response.data : [];
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]); // Set empty array on error
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || '';

  const pageName = pathname.split('/')[1] || 'Dashboard';

  const hasUnreadNotifications = Array.isArray(notifications) && notifications.some(n => !n.is_read);

  const markAsRead = async (notificationId: number) => {
    try {
      await api.post(`/notifications/${notificationId}/mark-read/`);
      setNotifications(prev =>
        Array.isArray(prev) ? prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        ) : []
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);
    
    // Close dropdown
    setShowNotifications(false);
    
    // Determine navigation based on notification title/message
    // You can customize this logic based on your notification types
    if (notification.title.toLowerCase().includes('appointment')) {
      if (user?.role === 'doctor') {
        router.push('/doctor');
      } else {
        router.push('/appointments');
      }
    } else if (notification.title.toLowerCase().includes('prescription')) {
      router.push('/prescriptions');
    } else if (notification.title.toLowerCase().includes('payment')) {
      router.push('/payments');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/mark-all-read/');
      setNotifications(prev =>
        Array.isArray(prev) ? prev.map(notif => ({ ...notif, is_read: true })) : []
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex justify-between items-center h-16 px-4 md:px-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center space-x-4">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
          {pageName}
        </div>
      </div>

      <div className="flex items-center space-x-3 relative">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => toggleDarkMode()}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
          aria-label="Toggle dark mode"
        >
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-[20px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

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
                  {loadingNotifications ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      Loading notifications...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notif.is_read ? 'bg-gray-50' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notif.created_at)}</p>
                          </div>
                          {!notif.is_read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-gray-200 text-center">
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      // You can create a notifications page later
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                  >
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
            className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-colors border border-gray-200"
          >
            {profilePictureUrl ? (
              <img 
                src={profilePictureUrl} 
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{fullName[0]?.toUpperCase() || 'U'}</span>
            )}
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
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-gray-700 font-semibold border border-gray-200">
                      {profilePictureUrl ? (
                        <img 
                          src={profilePictureUrl} 
                          alt={fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg">{fullName[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{fullName}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{user?.email}</p>
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

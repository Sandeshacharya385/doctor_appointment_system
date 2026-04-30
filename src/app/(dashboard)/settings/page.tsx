'use client';

import { useState, useEffect } from 'react';
import { useUIStore } from '@/store/useUIStore';

export default function SettingsPage() {
  const { isDarkMode, setDarkMode } = useUIStore();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Initialize theme based on current dark mode state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-preference') as 'light' | 'dark' | 'system' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // If no saved preference, set based on current dark mode
        setTheme(isDarkMode ? 'dark' : 'light');
      }
    }
  }, [isDarkMode]);

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme-preference', newTheme);

    if (newTheme === 'system') {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(systemPrefersDark);
    } else {
      // Use explicit preference
      setDarkMode(newTheme === 'dark');
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Preferences</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Customize your dashboard experience</p>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates via email</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-gray-900 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">SMS Notifications</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Receive updates via text message</p>
              </div>
              <button
                onClick={() => setSmsNotifications(!smsNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  smsNotifications ? 'bg-gray-900 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Appointment Reminders</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Get reminded before appointments</p>
              </div>
              <button
                onClick={() => setAppointmentReminders(!appointmentReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  appointmentReminders ? 'bg-gray-900 dark:bg-gray-700' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    appointmentReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Appearance</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme</label>
              <select 
                value={theme}
                onChange={(e) => handleThemeChange(e.target.value as 'light' | 'dark' | 'system')}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {theme === 'system' 
                  ? 'Using system preference' 
                  : `Currently using ${theme} mode`}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language</label>
              <select className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-4">Privacy & Security</h3>
          <div className="space-y-3">
            <button className="w-full md:w-auto px-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-900 dark:text-gray-100">
              Change Password
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Note: This is a placeholder page. Full functionality coming soon.
          </p>
          <button className="px-6 py-3 bg-gray-900 dark:bg-gray-800 text-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-800 dark:border-gray-700 font-semibold">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}


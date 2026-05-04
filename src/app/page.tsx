'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Only redirect if user is actually authenticated with a valid token
    const token = localStorage.getItem('access_token');
    if (token && (isAuthenticated || user)) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gray-900 dark:bg-gray-100 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white dark:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              MediBook
            </span>
          </Link>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
            Book doctor appointments online
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Find qualified doctors, schedule appointments, and manage your health records all in one place.
          </p>
          <Link href="/register">
            <button className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded font-medium hover:bg-gray-800 dark:hover:bg-gray-200">
              Get started
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Find Doctors Card */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Find doctors
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Search and filter doctors by specialization, availability, and ratings.
            </p>
            <Link href="/register">
              <button className="w-full px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                Browse doctors
              </button>
            </Link>
          </div>

          {/* Book Appointments Card */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Book appointments
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Schedule appointments at your convenience with real-time availability.
            </p>
            <Link href="/register">
              <button className="w-full px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                Schedule now
              </button>
            </Link>
          </div>

          {/* Manage Records Card */}
          <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-sm md:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-900 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Manage records
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Access your appointment history, prescriptions, and medical records.
            </p>
            <Link href="/register">
              <button className="w-full px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                View records
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © 2026 MediBook. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

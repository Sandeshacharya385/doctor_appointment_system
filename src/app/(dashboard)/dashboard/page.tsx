'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Appointment, Doctor } from '@/types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Wait for user to be loaded by the layout
      if (!user) {
        return;
      }
      
      setLoading(true);
      try {
        const [apptRes, docRes] = await Promise.all([
          api.get('/appointments/'),
          api.get('/doctors/'),
        ]);
        setAppointments(apptRes.data.results || apptRes.data);
        setDoctors(docRes.data.results || docRes.data);
      } catch (e: any) {
        console.error('Dashboard fetch error:', e);
        if (e.response?.status === 403) {
          console.error('403 Forbidden - Check user permissions and authentication token');
          toast.error('Access Denied', {
            description: 'You do not have permission to view this data.',
          });
        } else if (e.response?.status === 401) {
          toast.error('Session Expired', {
            description: 'Please log in again.',
          });
        } else {
          toast.error('Failed to Load Dashboard', {
            description: 'Could not fetch dashboard data. Please try again.',
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === todayStr);
  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const confirmedAppts = appointments.filter(a => a.status === 'confirmed');
  const nextAppt = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');

  const statusBadge: Record<string, string> = {
    confirmed: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
    pending:   'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
    completed: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
  };

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || 'User';

  // Show loading state while user is being loaded or data is being fetched
  if (!user || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Welcome back, {fullName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          {user?.role === 'patient' && (
            <Link href="/doctors">
              <button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-800 dark:border-gray-700">
                Book Appointment
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-[22px]">event_available</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Appointments</p>
          <p className="text-3xl font-semibold mt-2 text-gray-900 dark:text-gray-100">{appointments.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-[22px]">today</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Today's Appointments</p>
          <p className="text-3xl font-semibold mt-2 text-gray-900 dark:text-gray-100">{todayAppts.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-[22px]">pending_actions</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
          <p className="text-3xl font-semibold mt-2 text-gray-900 dark:text-gray-100">{pendingAppts.length}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <span className="material-symbols-outlined text-gray-700 dark:text-gray-300 text-[22px]">groups</span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Available Doctors</p>
          <p className="text-3xl font-semibold mt-2 text-gray-900 dark:text-gray-100">{doctors.length}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Appointments List */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Appointments</h3>
            <Link href="/appointments" className="text-gray-900 dark:text-gray-100 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
                <span className="material-symbols-outlined text-[48px] mb-3">event_busy</span>
                <p className="text-sm font-medium">No appointments scheduled</p>
                {user?.role === 'patient' && (
                  <Link href="/doctors" className="mt-3 text-gray-900 dark:text-gray-100 text-sm font-medium hover:underline">Book an appointment</Link>
                )}
              </div>
            ) : (
              appointments.slice(0, 5).map((appt) => (
                <div key={appt.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold text-sm">
                        {appt.doctor_details?.user?.first_name?.[0] || 'D'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.role === 'patient'
                            ? `Dr. ${appt.doctor_details?.user?.first_name} ${appt.doctor_details?.user?.last_name}`
                            : `${appt.patient?.first_name || appt.patient?.username}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {appt.doctor_details?.specialization} • {appt.appointment_date} at {appt.appointment_time?.slice(0, 5)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${statusBadge[appt.status]}`}>
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* Next Appointment */}
          {nextAppt ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Next Appointment</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">
                    {nextAppt.doctor_details?.user?.first_name?.[0] || 'D'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Dr. {nextAppt.doctor_details?.user?.first_name} {nextAppt.doctor_details?.user?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{nextAppt.doctor_details?.specialization}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-[18px] mr-2">schedule</span>
                    <span>{nextAppt.appointment_date} at {nextAppt.appointment_time?.slice(0, 5)}</span>
                  </div>
                </div>
                <Link href="/appointments">
                  <button className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white py-3 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-800 dark:border-gray-700">
                    View Details
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-[40px] text-gray-300 mb-2 block">event_available</span>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No upcoming appointments</p>
                {user?.role === 'patient' && (
                  <Link href="/doctors">
                    <button className="mt-4 bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-800 dark:border-gray-700">
                      Book Now
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Appointment Status */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Appointment Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Confirmed', count: confirmedAppts.length, color: 'bg-green-500' },
                { label: 'Pending',   count: pendingAppts.length,   color: 'bg-yellow-500' },
                { label: 'Completed', count: appointments.filter(a => a.status === 'completed').length, color: 'bg-blue-500' },
                { label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length, color: 'bg-gray-300' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: appointments.length > 0 ? `${(item.count / appointments.length) * 100}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


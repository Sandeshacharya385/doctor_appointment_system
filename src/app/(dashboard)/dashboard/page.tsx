'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Appointment, Doctor } from '@/types';
import { format } from 'date-fns';

const roleConfig = {
  patient: { label: 'Patient', icon: 'person', color: 'bg-blue-100 text-blue-700', banner: 'bg-blue-600' },
  doctor:  { label: 'Doctor',  icon: 'stethoscope', color: 'bg-emerald-100 text-emerald-700', banner: 'bg-emerald-600' },
  admin:   { label: 'Admin',   icon: 'admin_panel_settings', color: 'bg-purple-100 text-purple-700', banner: 'bg-purple-600' },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  const role = (user?.role || 'patient') as keyof typeof roleConfig;
  const rc = roleConfig[role] || roleConfig.patient;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, docRes] = await Promise.all([
          api.get('/appointments/'),
          api.get('/doctors/'),
        ]);
        setAppointments(apptRes.data.results || apptRes.data);
        setDoctors(docRes.data.results || docRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === todayStr);
  const pendingAppts = appointments.filter(a => a.status === 'pending');
  const confirmedAppts = appointments.filter(a => a.status === 'confirmed');
  const nextAppt = appointments.find(a => a.status === 'confirmed' || a.status === 'pending');

  const statusColor: Record<string, string> = {
    confirmed: 'bg-emerald-50 border-emerald-500 text-emerald-700',
    pending:   'bg-amber-50 border-amber-500 text-amber-700',
    cancelled: 'bg-slate-50 border-slate-300 text-slate-600 opacity-60',
    completed: 'bg-blue-50 border-blue-500 text-blue-700',
  };
  const statusBadge: Record<string, string> = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending:   'bg-amber-100 text-amber-700',
    cancelled: 'bg-slate-200 text-slate-600',
    completed: 'bg-blue-100 text-blue-700',
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const today = now.getDate();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const calDays: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  const barHeights = ['h-[40%]', 'h-[65%]', 'h-[85%]', 'h-[100%]', 'h-[75%]', 'h-[50%]', 'h-[30%]'];
  const barColors  = ['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-600', 'bg-blue-300', 'bg-blue-100', 'bg-blue-50'];
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`.trim()
    : user?.username || 'User';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── User Identity Banner ── */}
      <div className={`${rc.banner} rounded-2xl p-6 text-white flex items-center justify-between shadow-lg`}>
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-2xl font-bold">
            {fullName[0]?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="material-symbols-outlined text-[18px]">{rc.icon}</span>
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">{rc.label}</span>
            </div>
            <h2 className="text-xl font-bold">{fullName}</h2>
            <p className="text-sm opacity-75">{user?.email}</p>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-sm opacity-75">{format(new Date(), 'EEEE, MMMM d yyyy')}</p>
          <p className="text-lg font-bold mt-1">
            {todayAppts.length > 0
              ? `${todayAppts.length} appointment${todayAppts.length > 1 ? 's' : ''} today`
              : 'No appointments today'}
          </p>
          {role === 'patient' && (
            <Link href="/doctors">
              <button className="mt-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                + Book Appointment
              </button>
            </Link>
          )}
          {role === 'admin' && (
            <a href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer">
              <button className="mt-3 bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                Admin Panel →
              </button>
            </a>
          )}
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <span className="material-symbols-outlined text-[22px]">event_available</span>
            </div>
            <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">Total</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Total Appointments</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{appointments.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <span className="material-symbols-outlined text-[22px]">today</span>
            </div>
            <span className="text-slate-400 text-[10px] font-bold">Today</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Today's Appointments</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{todayAppts.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <span className="material-symbols-outlined text-[22px]">groups</span>
            </div>
            <span className="text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Available Doctors</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{doctors.length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <span className="material-symbols-outlined text-[22px]">pending_actions</span>
            </div>
            <span className="text-amber-500 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold">Pending</span>
          </div>
          <p className="text-slate-500 text-xs font-medium">Pending Appointments</p>
          <p className="text-2xl font-bold mt-1 text-slate-900">{pendingAppts.length}</p>
        </div>
      </div>

      {/* ── Main Split Grid 70/30 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 items-start">
        {/* Schedule */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
            <span className="text-sm font-semibold text-slate-700">{format(new Date(), 'MMM d, yyyy')}</span>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <span className="material-symbols-outlined text-[48px] mb-3">event_busy</span>
                <p className="text-sm font-medium">No appointments scheduled</p>
                {role === 'patient' && (
                  <Link href="/doctors" className="mt-3 text-blue-600 text-sm font-semibold hover:underline">Book an appointment</Link>
                )}
              </div>
            ) : (
              appointments.slice(0, 6).map((appt) => (
                <div key={appt.id} className="flex min-h-[90px] border-b border-slate-50">
                  <div className="w-20 p-4 text-right border-r border-slate-50 flex-shrink-0">
                    <span className="text-xs font-bold text-slate-400">{appt.appointment_time?.slice(0, 5)}</span>
                  </div>
                  <div className="flex-1 p-2 relative">
                    <div className={`absolute inset-2 border-l-4 rounded-r-lg p-3 flex justify-between items-center ${statusColor[appt.status] || 'bg-slate-50 border-slate-300'}`}>
                      <div>
                        <p className="text-xs font-bold">
                          {role === 'patient'
                            ? `Dr. ${appt.doctor_details?.user?.first_name} ${appt.doctor_details?.user?.last_name}`
                            : `${appt.patient?.first_name || appt.patient?.username}`}
                        </p>
                        <p className="text-[10px] mt-0.5 opacity-80">
                          {appt.reason?.slice(0, 40)}{(appt.reason?.length || 0) > 40 ? '...' : ''} • {appt.doctor_details?.specialization}
                        </p>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold capitalize ${statusBadge[appt.status]}`}>
                        {appt.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right utilities */}
        <div className="lg:col-span-3 space-y-6">
          {nextAppt ? (
            <div className={`${rc.banner} text-white p-6 rounded-xl shadow-xl`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20">
                  {nextAppt.doctor_details?.user?.first_name?.[0] || 'D'}
                </div>
                <div>
                  <p className="text-sm font-bold opacity-80">Next Appointment</p>
                  <h4 className="text-base font-bold">
                    Dr. {nextAppt.doctor_details?.user?.first_name} {nextAppt.doctor_details?.user?.last_name}
                  </h4>
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span>{nextAppt.appointment_date} at {nextAppt.appointment_time?.slice(0, 5)}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm mt-1">
                  <span className="material-symbols-outlined text-[18px]">medical_services</span>
                  <span>{nextAppt.doctor_details?.specialization}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/appointments">
                  <button className="bg-white text-slate-800 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors w-full">
                    View Details
                  </button>
                </Link>
                <Link href="/payments">
                  <button className="bg-white/20 text-white py-2.5 rounded-lg text-sm font-bold border border-white/30 hover:bg-white/30 transition-colors w-full">
                    Pay Now
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className={`${rc.banner} text-white p-6 rounded-xl shadow-xl`}>
              <div className="text-center py-4">
                <span className="material-symbols-outlined text-[40px] opacity-60 mb-2 block">event_available</span>
                <p className="font-semibold">No upcoming appointments</p>
                {role === 'patient' && (
                  <Link href="/doctors">
                    <button className="mt-4 bg-white/20 border border-white/30 text-white py-2 px-4 rounded-lg text-sm font-bold hover:bg-white/30 transition-colors">
                      Book Now
                    </button>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Mini Calendar */}
          <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-sm text-slate-900">{monthName}</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 mb-2">
              {['S','M','T','W','T','F','S'].map((d, i) => <span key={i}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
              {calDays.map((d, i) => (
                <span key={i} className={`py-1 rounded-lg ${
                  d === today ? `${rc.banner} text-white shadow-md` :
                  d ? 'text-slate-700 hover:bg-slate-50 cursor-pointer' : ''
                }`}>
                  {d || ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-900">Recent Appointments</h3>
            <Link href="/appointments" className="text-blue-600 text-sm font-semibold hover:underline">View All</Link>
          </div>
          <div className="p-6">
            {appointments.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No appointments yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="text-left text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    <th className="pb-4">Doctor</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {appointments.slice(0, 4).map(appt => (
                    <tr key={appt.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full ${rc.color} flex items-center justify-center font-bold text-xs flex-shrink-0`}>
                            {appt.doctor_details?.user?.first_name?.[0] || 'D'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs">
                              Dr. {appt.doctor_details?.user?.first_name} {appt.doctor_details?.user?.last_name}
                            </p>
                            <p className="text-[10px] text-slate-500">{appt.doctor_details?.specialization}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-slate-600 font-medium text-xs">{appt.appointment_date}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold capitalize ${statusBadge[appt.status]}`}>
                          {appt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Weekly Activity</h3>
            </div>
            <div className="h-32 flex items-end space-x-2">
              {barHeights.map((h, i) => (
                <div key={i} className={`flex-1 ${h} ${barColors[i]} rounded-t-sm relative`}>
                  <div className="absolute -top-1 w-full border-t-2 border-blue-600 opacity-60" />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              {days.map(d => (
                <span key={d} className="text-[10px] font-bold text-slate-400 flex-1 text-center">{d}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Appointment Status</h3>
              <span className="text-xs font-semibold text-slate-500">{appointments.length} total</span>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Confirmed', count: confirmedAppts.length, color: 'bg-emerald-500' },
                { label: 'Pending',   count: pendingAppts.length,   color: 'bg-amber-500' },
                { label: 'Completed', count: appointments.filter(a => a.status === 'completed').length, color: 'bg-blue-500' },
                { label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length, color: 'bg-slate-300' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-600">{item.label}</span>
                    <span className="font-bold text-slate-900">{item.count}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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

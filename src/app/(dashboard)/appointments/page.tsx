'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Appointment } from '@/types';
import { format } from 'date-fns';

const statusBadge: Record<string, string> = {
  confirmed: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  pending:   'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  cancelled: 'bg-slate-200 text-slate-600',
  completed: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
};

export default function AppointmentsPage() {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/appointments/')
      .then(r => setAppointments(r.data.results || r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cancelAppointment = async (id: number) => {
    if (!confirm('Cancel this appointment?')) return;
    await api.patch(`/appointments/${id}/`, { status: 'cancelled' });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
  };

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-slate-400 text-sm">Loading...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
            {user?.role === 'doctor' ? 'Patient Appointments' : 'My Appointments'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            {user?.role === 'patient' ? 'Your booked appointments and treatment history' : 'Manage your patient appointments'}
          </p>
        </div>
        {user?.role === 'patient' && (
          <Link href="/doctors">
            <button className="bg-gray-900 hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-800 dark:border-gray-700 flex items-center space-x-2">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Book Appointment</span>
            </button>
          </Link>
        )}
      </div>

      {/* Filter */}
      <div className="flex space-x-2 flex-wrap gap-y-2">
        {['all','pending','confirmed','completed','cancelled'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
              filter === s ? 'bg-gray-900 text-white dark:bg-gray-700' : 'bg-white dark:bg-gray-900 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            }`}>
            {s} {s !== 'all' && `(${appointments.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-16 text-center shadow-sm border border-slate-50 dark:border-gray-800">
          <span className="material-symbols-outlined text-[56px] text-slate-300 dark:text-gray-700 mb-4 block">event_busy</span>
          <p className="text-slate-500 dark:text-gray-400 font-medium">No {filter !== 'all' ? filter : ''} appointments</p>
          {user?.role === 'patient' && (
            <Link href="/doctors" className="mt-3 inline-block text-gray-900 dark:text-gray-100 text-sm font-semibold hover:underline">
              Book your first appointment →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(appt => (
            <div key={appt.id} className="bg-white dark:bg-gray-900 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 dark:border-gray-800 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {user?.role === 'patient'
                      ? (appt.doctor_details?.user?.first_name?.[0] || 'D')
                      : (appt.patient?.first_name?.[0] || 'P')}
                  </div>
                  <div>
                    {user?.role === 'patient' ? (
                      <>
                        <h3 className="font-bold text-slate-900 dark:text-gray-100">
                          Dr. {appt.doctor_details?.user?.first_name} {appt.doctor_details?.user?.last_name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{appt.doctor_details?.specialization}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold text-slate-900 dark:text-gray-100">
                          {appt.patient?.first_name} {appt.patient?.last_name || appt.patient?.username}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-gray-400">{appt.patient?.email}</p>
                      </>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        <span>{format(new Date(appt.appointment_date), 'MMM d, yyyy')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{appt.appointment_time?.slice(0,5)}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">Reason: {appt.reason}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold capitalize ${statusBadge[appt.status]}`}>
                    {appt.status}
                  </span>

                  {/* Patient actions */}
                  {user?.role === 'patient' && (
                    <div className="flex space-x-2">
                      {appt.status === 'completed' && appt.prescription && (
                        <Link href="/prescriptions">
                          <button className="text-xs bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all flex items-center space-x-1">
                            <span className="material-symbols-outlined text-[14px]">medication</span>
                            <span>View Prescription</span>
                          </button>
                        </Link>
                      )}
                      {(appt.status === 'pending' || appt.status === 'confirmed') && (
                        <button onClick={() => cancelAppointment(appt.id)}
                          className="text-xs bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-all">
                          Cancel
                        </button>
                      )}
                      {appt.status === 'completed' && (
                        <Link href={`/appointments/book?doctor=${appt.doctor}`}>
                          <button className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-gray-700 dark:text-emerald-400 px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-emerald-900/50 transition-all">
                            Follow-up
                          </button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Prescription preview for patient */}
              {user?.role === 'patient' && appt.prescription && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-800">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="material-symbols-outlined text-gray-900 dark:text-gray-100 text-[18px]">medication</span>
                    <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">Prescription</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-600 dark:text-gray-400 mb-1">Diagnosis</p>
                    <p className="text-sm text-slate-800 dark:text-gray-200">{appt.prescription.diagnosis}</p>
                    {appt.prescription.medicines.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {appt.prescription.medicines.map((med, i) => (
                          <span key={i} className="text-xs bg-white dark:bg-gray-900 text-slate-700 dark:text-gray-300 px-3 py-1 rounded-full border border-blue-200 dark:border-gray-700 font-medium">
                            {med.name} · {med.dosage} · {med.frequency_display || med.frequency}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



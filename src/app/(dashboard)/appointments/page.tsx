'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Appointment } from '@/types';
import { format } from 'date-fns';

const statusBadge: Record<string, string> = {
  confirmed: 'bg-emerald-100 text-emerald-700',
  pending:   'bg-amber-100 text-amber-700',
  cancelled: 'bg-slate-200 text-slate-600',
  completed: 'bg-blue-100 text-blue-700',
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
          <h2 className="text-2xl font-bold text-slate-900">
            {user?.role === 'doctor' ? 'Patient Appointments' : 'My Appointments'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {user?.role === 'patient' ? 'Your booked appointments and treatment history' : 'Manage your patient appointments'}
          </p>
        </div>
        {user?.role === 'patient' && (
          <Link href="/doctors">
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all flex items-center space-x-2 shadow-lg shadow-blue-200">
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
              filter === s ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
            }`}>
            {s} {s !== 'all' && `(${appointments.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center shadow-sm border border-slate-50">
          <span className="material-symbols-outlined text-[56px] text-slate-300 mb-4 block">event_busy</span>
          <p className="text-slate-500 font-medium">No {filter !== 'all' ? filter : ''} appointments</p>
          {user?.role === 'patient' && (
            <Link href="/doctors" className="mt-3 inline-block text-blue-600 text-sm font-semibold hover:underline">
              Book your first appointment →
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(appt => (
            <div key={appt.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {user?.role === 'patient'
                      ? (appt.doctor_details?.user?.first_name?.[0] || 'D')
                      : (appt.patient?.first_name?.[0] || 'P')}
                  </div>
                  <div>
                    {user?.role === 'patient' ? (
                      <>
                        <h3 className="font-bold text-slate-900">
                          Dr. {appt.doctor_details?.user?.first_name} {appt.doctor_details?.user?.last_name}
                        </h3>
                        <p className="text-sm text-slate-500">{appt.doctor_details?.specialization}</p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold text-slate-900">
                          {appt.patient?.first_name} {appt.patient?.last_name || appt.patient?.username}
                        </h3>
                        <p className="text-sm text-slate-500">{appt.patient?.email}</p>
                      </>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        <span>{format(new Date(appt.appointment_date), 'MMM d, yyyy')}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        <span>{appt.appointment_time?.slice(0,5)}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Reason: {appt.reason}</p>
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
                          <button className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-100 transition-all flex items-center space-x-1">
                            <span className="material-symbols-outlined text-[14px]">medication</span>
                            <span>View Prescription</span>
                          </button>
                        </Link>
                      )}
                      {(appt.status === 'pending' || appt.status === 'confirmed') && (
                        <button onClick={() => cancelAppointment(appt.id)}
                          className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition-all">
                          Cancel
                        </button>
                      )}
                      {appt.status === 'completed' && (
                        <Link href={`/appointments/book?doctor=${appt.doctor}`}>
                          <button className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-100 transition-all">
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
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="material-symbols-outlined text-blue-600 text-[18px]">medication</span>
                    <p className="text-sm font-semibold text-slate-700">Prescription</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-600 mb-1">Diagnosis</p>
                    <p className="text-sm text-slate-800">{appt.prescription.diagnosis}</p>
                    {appt.prescription.medicines.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {appt.prescription.medicines.map((med, i) => (
                          <span key={i} className="text-xs bg-white text-slate-700 px-3 py-1 rounded-full border border-blue-200 font-medium">
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

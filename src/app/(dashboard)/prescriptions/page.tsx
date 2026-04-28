'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Prescription } from '@/types';

interface PrescriptionWithMeta extends Prescription {
  appointment_date: string;
  doctor_name: string;
  specialization: string;
}

const FREQ_LABEL: Record<string, string> = {
  once_daily: 'Once Daily', twice_daily: 'Twice Daily',
  three_times_daily: '3× Daily', four_times_daily: '4× Daily',
  every_morning: 'Every Morning', every_night: 'Every Night',
  before_meal: 'Before Meal', after_meal: 'After Meal', as_needed: 'As Needed',
};

export default function PrescriptionsPage() {
  const { user } = useAuthStore();
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only patients can access this page
    if (user?.role !== 'patient') {
      setError('This page is only accessible to patients. Doctors can view prescriptions from the appointments page.');
      setLoading(false);
      return;
    }

    api.get('/appointments/my-prescriptions/')
      .then(r => setPrescriptions(r.data))
      .catch((err) => {
        console.error('Failed to load prescriptions:', err);
        setError('Failed to load prescriptions. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Loading prescriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Prescriptions</h2>
          <p className="text-sm text-gray-500 mt-1">Prescriptions from your completed appointments</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-sm">
          <span className="material-symbols-outlined text-[56px] text-red-300 mb-4 block">error</span>
          <p className="text-gray-900 font-medium mb-2">Access Restricted</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">My Prescriptions</h2>
        <p className="text-sm text-slate-500 mt-1">Prescriptions from your completed appointments</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-16 text-center shadow-sm">
          <span className="material-symbols-outlined text-[56px] text-slate-300 mb-4 block">medication</span>
          <p className="text-slate-500 font-medium">No prescriptions yet</p>
          <p className="text-slate-400 text-sm mt-1">Prescriptions will appear here after your doctor completes a checkup</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map(presc => (
            <div key={presc.id} className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-50 overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpanded(expanded === presc.id ? null : presc.id)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {presc.doctor_name.split(' ').pop()?.[0] || 'D'}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900">{presc.doctor_name}</p>
                    <p className="text-sm text-slate-500">{presc.specialization}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{presc.appointment_date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold">
                    {presc.medicines.length} medicine{presc.medicines.length !== 1 ? 's' : ''}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">
                    {expanded === presc.id ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </button>

              {/* Expanded details */}
              {expanded === presc.id && (
                <div className="px-6 pb-6 border-t border-slate-100 space-y-5">
                  {/* Diagnosis */}
                  <div className="pt-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Diagnosis</p>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                      <p className="text-sm text-slate-800 font-medium">{presc.diagnosis}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  {presc.instructions && (
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Doctor's Instructions</p>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <p className="text-sm text-slate-700">{presc.instructions}</p>
                      </div>
                    </div>
                  )}

                  {/* Medicines */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Medicines & Timetable</p>
                    <div className="space-y-3">
                      {presc.medicines.map((med, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-bold text-slate-900">{med.name}</p>
                              <p className="text-sm text-slate-600 mt-0.5">{med.dosage}</p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold flex-shrink-0 ml-3">
                              {FREQ_LABEL[med.frequency] || med.frequency}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500">
                            <span className="flex items-center space-x-1">
                              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                              <span>{med.duration_days} day{med.duration_days !== 1 ? 's' : ''}</span>
                            </span>
                            {med.timing_notes && (
                              <span className="flex items-center space-x-1">
                                <span className="material-symbols-outlined text-[14px]">info</span>
                                <span>{med.timing_notes}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Print hint */}
                  <div className="flex justify-end">
                    <button onClick={() => window.print()}
                      className="flex items-center space-x-2 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 px-4 py-2 rounded-lg transition-all hover:bg-slate-50">
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      <span>Print Prescription</span>
                    </button>
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
